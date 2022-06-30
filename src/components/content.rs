use dioxus::prelude::*;

#[inline_props]
pub fn Href<'a>(cx: Scope, to: &'a str, children: Element<'a>) -> Element {
    cx.render(rsx! {
        a {
            class: "text-cyan-700 dark:text-cyan-100 underline",
            href: "{to}",
            target: "_blank",
            children
        }
    })
}

#[derive(Props, PartialEq)]
pub struct MarkdownProps {
    content: String,
}

pub fn Markdown(cx: Scope<MarkdownProps>) -> Element {
    cx.render(rsx! {
        div {

        }
    })
}