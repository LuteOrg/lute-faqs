// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><a href="intro.html">Introduction</a></li><li class="chapter-item "><a href="help.html">Where can I get help?</a></li><li class="chapter-item affix "><li class="part-title">Setup</li><li class="chapter-item "><a href="setup/web-server.html">Can I run Lute on a private web server?</a></li><li class="chapter-item "><a href="setup/mobile-support.html">Can I run Lute on my phone or pad?</a></li><li class="chapter-item "><a href="setup/usb.html">Can I store Lute data on a USB key?</a></li><li class="chapter-item "><a href="setup/nix.html">Can I deploy Lute on NixOS?</a></li><li class="chapter-item "><a href="setup/adding-basic-auth.html">Can I make Lute secure?</a></li><li class="chapter-item "><a href="setup/online-lute.html">Is there an online version of Lute?</a></li><li class="chapter-item "><a href="setup/v2-to-v3.html">How can I migrate from Lute v2 to v3?</a></li><li class="chapter-item affix "><li class="part-title">Languages</li><li class="chapter-item "><a href="language/add-a-language.html">Can you add language X?</a></li><li class="chapter-item affix "><li class="part-title">Books</li><li class="chapter-item "><a href="books/finding-stuff.html">Where can I find books to import?</a></li><li class="chapter-item "><a href="books/epub-import.html">Why won&#39;t my epub import correctly?</a></li><li class="chapter-item "><a href="books/pdf-import.html">Why won&#39;t my pdf import correctly?</a></li><li class="chapter-item "><a href="books/utf-8.html">My text file import is giving a "utf-8 encoding" error message</a></li><li class="chapter-item affix "><li class="part-title">Reading</li><li class="chapter-item "><a href="reading/click-not-working.html">I can&#39;t click on words in the reading screen</a></li><li class="chapter-item affix "><li class="part-title">Terms</li><li class="chapter-item "><a href="terms/terms-cannot-be-changed-once-created.html">Why can&#39;t I change a Term?</a></li><li class="chapter-item "><a href="terms/sentences-only-shown-when-page-is-read.html">Where are my new Term&#39;s sentences?</a></li><li class="chapter-item "><a href="terms/term-statuses.html">How should I use statuses?</a></li><li class="chapter-item "><a href="terms/term-parents.html">What are Term parents?</a></li><li class="chapter-item affix "><li class="part-title">Development</li><li class="chapter-item "><a href="dev/prioritizing-dev-work.html">How is development work prioritized?</a></li><li class="chapter-item "><a href="dev/contributing.html">Can I contribute to Lute&#39;s code?</a></li><li class="chapter-item affix "><li class="part-title">Misc</li><li class="chapter-item "><a href="import-from-other-systems.html">Can I import data from other systems?</a></li><li class="chapter-item "><a href="why-no-flashcards.html">Why doesn&#39;t Lute have flashcards, or an SRS?</a></li><li class="chapter-item "><a href="free.html">Why is this free?</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
