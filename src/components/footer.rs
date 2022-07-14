use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{fa_brands_icons, fa_solid_icons},
    Icon,
};

use crate::hooks::mode::{is_dark, mode};

pub fn Footer(cx: Scope) -> Element {
    log::info!("dark mode: {:?}", is_dark(&cx));
    let mode_icon = if is_dark(&cx) {
        fa_solid_icons::FaSun
    } else {
        fa_solid_icons::FaMoon
    };

    cx.render(rsx! {
        div {
            class: "mt-6 flex space-x-4 justify-center",
            Link {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                to: "/",
                Icon {
                    size: 26,
                    icon: fa_solid_icons::FaHouse
                }
            }
            a {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                href: "javascript:;",
                onclick: move |_| {
                    let is_dark = mode_icon == fa_solid_icons::FaMoon;
                    mode(&cx, is_dark);
                    cx.needs_update();
                },
                Icon {
                    size: 26,
                    icon: mode_icon
                }
            }
            Link {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                to: "/about",
                Icon {
                    size: 26,
                    icon: fa_solid_icons::FaBook
                }
            }
            a {
                class: "text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200",
                href: "https://github.com/mrxiaozhuox/dioxus-starter",
                Icon {
                    size: 26,
                    icon: fa_brands_icons::FaGithub
                }
            }
        }
        div {
            class: "mt-10 flex justify-center text-gray-400",
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
