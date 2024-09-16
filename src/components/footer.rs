use crate::hooks::mode::{mode, use_mode};
use dioxus::prelude::*;
use dioxus_free_icons::{
    icons::{fa_brands_icons, fa_solid_icons},
    Icon,
};

pub fn Footer() -> Element {
    let mut current_mode = use_mode();
    rsx! {
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
                    let is_dark = !current_mode.read().clone();
                    // current_mode.set(dark);
                    *current_mode.write() = is_dark;
                    mode(is_dark);
                },
                if current_mode.read().clone() {
                    Icon {
                        height: 26,
                        width: 26,
                        icon: fa_solid_icons::FaSun
                    }
                } else {
                    Icon {
                        height: 26,
                        width: 26,
                        icon: fa_solid_icons::FaMoon
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
    }
}
