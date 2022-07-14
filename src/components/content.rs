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

#[derive(Props, PartialEq)]
pub struct MarkdownProps {
    #[props(default)]
    class: String,
    content: String,
}

pub fn Markdown(cx: Scope<MarkdownProps>) -> Element {
    let md_parser = use_markdown(&cx);
    let content = md_parser(cx.props.content.clone());
    let _ = js_sys::eval("setTimeout(() => {initMarkdownBody();}, 100);");
    let extra_class = &cx.props.class;
    cx.render(rsx! {
        div {
            id: "markdown-body",
            class: "{extra_class}",
            dangerous_inner_html: "{content}",
        }
    })
}
