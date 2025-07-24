document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav.sidebar a");
    const pages = document.querySelectorAll(".page");

    links.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            links.forEach(l => l.classList.remove("active"));
            pages.forEach(page => page.classList.remove("active"));

            link.classList.add("active");

            const pageId = link.dataset.page;
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add("active");
            }
        });
    });
});
