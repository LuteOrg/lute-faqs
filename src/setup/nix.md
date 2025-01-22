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
