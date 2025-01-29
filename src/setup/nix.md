# Can I deploy Lute on NixOS?

Deploy Lute on NixOS in three simple steps using [compose2nix](https://github.com/aksiksi/compose2nix).

## 1. Create `docker-compose.yml`

```yaml
name: 'lute'
services:
  lute:
    image: jzohrab/lute3:latest
    ports:
      - 5006:5001
    volumes:
      - /var/lib/lute/data:/lute_data
      - /var/lib/lute/backup:/lute_backup
```

## 2. Convert to NixOS Module

```bash
$ nix run github:aksiksi/compose2nix
```

## 3. Import the Module

Add to your NixOS configuration:
```nix
imports = [
  ./docker-compose.nix
];
```

That's it! NixOS will handle all the necessary setup, including creating and setting permissions for the directories, when you rebuild your configuration. 


# Updating under NixOS

If you install using docker/podman, you can update as root using 

```bash
$ podman pull lute3:latest
```

and then restarting the system service or server

if you want to do it automatically, here is a nix module to do so: 


```nix
{
  config,
  lib,
  pkgs,
  ...
}:
with lib; let
  cfg = config.services.containerUpdater;
in {
  options.services.containerUpdater = {
    enable = mkEnableOption "automatic container updates";

    updateTime = mkOption {
      type = types.str;
      default = "Mon 02:00";
      description = "When to run the container updates (systemd calendar format)";
    };

    extraFlags = mkOption {
      type = types.listOf types.str;
      default = [];
      description = "Additional flags to pass to podman pull";
    };

    containers = mkOption {
      type = types.listOf types.str;
      default = [];
      description = "List of specific containers to update. If empty, updates all containers.";
    };

    restartContainers = mkOption {
      type = types.bool;
      default = false;
      description = "Whether to restart containers after updating";
    };
  };

  config = mkIf cfg.enable {
    systemd.services.containerUpdater = {
      description = "Update container images";
      path = [pkgs.podman];
      script = ''
        # Function to update containers
        update_containers() {
          local containers=()

          # If specific containers are specified, use those
          if [ ''${#containerList[@]} -gt 0 ]; then
            containers=("''${containerList[@]}")
          else
            # Otherwise get all running containers
            while IFS= read -r line; do
              containers+=("$line")
            done < <(podman ps -a --format="{{.Image}}" | sort -u)
          fi

          # Update each container
          for image in "''${containers[@]}"; do
            echo "Updating container image: $image"
            podman pull ''${pullFlags[@]} "$image"

            if [ "$RESTART_CONTAINERS" = "true" ]; then
              container_ids=$(podman ps -q --filter "ancestor=$image")
              if [ -n "$container_ids" ]; then
                echo "Restarting containers using image: $image"
                echo "$container_ids" | xargs -r podman restart
              fi
            fi
          done
        }

        # Set up environment variables
        declare -a containerList=(${escapeShellArgs cfg.containers})
        declare -a pullFlags=(${escapeShellArgs cfg.extraFlags})
        RESTART_CONTAINERS="${boolToString cfg.restartContainers}"

        # Run the update
        update_containers
      '';

      serviceConfig = {
        Type = "oneshot";
        RemainAfterExit = false;
      };
    };

    systemd.timers.containerUpdater = {
      wantedBy = ["timers.target"];
      timerConfig = {
        OnCalendar = cfg.updateTime;
        Persistent = true;
        Unit = "containerUpdater.service";
      };
    };
  };
}

```

Just import it into your configuration, 

and then set the following options: 

```nix
{ config, pkgs, ... }:
{
  imports = [ ./container-updater.nix ];
  
  services.containerUpdater = {
    enable = true;
    containers = [ "lute3:latest"  ];  # Specific containers to update

    # Optional configurations:
    # updateTime = "Mon 02:00";  # When to run updates
    # extraFlags = [  ];  # Additional podman pull flags
    # restartContainers = true;  # Automatically restart containers after update
  };
}
```
