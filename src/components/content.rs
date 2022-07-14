use dioxus::prelude::*;

use crate::hooks::markdown::use_markdown;

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

#[derive(Props)]
pub struct MarkdownProps<'a> {
    #[props(default)]
    class: &'a str,
    content: String,
}

pub fn Markdown<'a>(cx: Scope<'a, MarkdownProps<'a>>) -> Element {
    let md_parser = use_markdown(&cx);
    let content = md_parser(cx.props.content.clone());
    let extra_class = &cx.props.class;
    cx.render(rsx! {
        div {
            id: "markdown-body",
            class: "prose {extra_class}",
            dangerous_inner_html: "{content}",
        }
    })
}
