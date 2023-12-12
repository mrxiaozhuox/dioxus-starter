use crate::hooks::mode::{is_dark, mode};
use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{fa_brands_icons, fa_solid_icons},
    Icon,
};
use dioxus_router::prelude::*;

pub fn Footer(cx: Scope) -> Element {
    log::info!("dark mode: {:?}", is_dark(&cx));
    let current_mode = is_dark(&cx);
    cx.render(rsx! {
        div { class: "mt-6 flex space-x-4 justify-center",
            Link {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                to: "/",
                Icon { height: 26, width: 26, icon: fa_solid_icons::FaHouse }
            }
            a {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                href: "javascript:;",
                onclick: move |_| {
                    let is_dark = !current_mode;
                    mode(&cx, is_dark);
                    cx.needs_update();
                },
                if is_dark(&cx) {
                    rsx! {
                        Icon {
                            height: 26,
                            width: 26,
                            icon: fa_solid_icons::FaSun
                        }
                    }
                } else {
                    rsx! {
                        Icon {
                            height: 26,
                            width: 26,
                            icon: fa_solid_icons::FaMoon
                        }
                    }
                }
            }
            Link {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                to: "/about",
                Icon { height: 26, width: 26, icon: fa_solid_icons::FaBook }
            }
            a {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                href: "https://github.com/mrxiaozhuox/dioxus-starter",
                Icon { height: 26, width: 26, icon: fa_brands_icons::FaGithub }
            }
        }
        div { class: "mt-10 flex justify-center text-gray-400",
            span {
                "[ made by "
                a {
                    class: "underline",
                    href: "https://github.com/mrxiaozhuox/",
                    target: "_blank",
                    "@mrxiaozhuox"
                }
                " ]"
            }
        }
    })
}
