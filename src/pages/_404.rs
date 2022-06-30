use dioxus::prelude::*;

use crate::components::footer::Footer;

pub fn NotFound(cx: Scope) -> Element {
    cx.render(rsx! {
        section {
            class: "h-screen bg-cover bg-white dark:bg-gray-600",
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    h1 {
                        class: "text-3xl sm:text-5xl capitalize tracking-widest dark:text-white lg:text-6xl",
                        "Page Not Found"
                    }
                    Footer {}
                }
            }
        }
    })
}
