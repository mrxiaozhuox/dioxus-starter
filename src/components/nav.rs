use dioxus::prelude::*;
use dioxus_free_icons::{Icon, icons::{fa_solid_icons, fa_brands_icons}};

use crate::{mode::mode, DARK_MODE};

pub fn ButtonList(cx: Scope) -> Element {

    let mode_icon = if *use_read(&cx, DARK_MODE) {
        fa_solid_icons::FaSun
    } else {
        fa_solid_icons::FaMoon
    };
    let set_mode = use_set(&cx, DARK_MODE);

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
                    mode(is_dark);
                    set_mode(is_dark);
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
    })
}