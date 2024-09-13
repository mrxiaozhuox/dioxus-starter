use dioxus::prelude::*;
use pulldown_cmark::Parser;

#[component]
pub fn Href(to: ReadOnlySignal<String>, children: Element) -> Element {
    rsx! {
        a { class: "text-cyan-700 dark:text-cyan-100 underline", href: "{to}", target: "_blank", { children } }
    }
}

#[derive(Props, PartialEq, Clone)]
pub struct MarkdownProps {
    #[props(default)]
    class: ReadOnlySignal<String>,
    content: String,
}

#[component]
pub fn Markdown(props: MarkdownProps) -> Element {
    let content = &props.content;
    let parser = Parser::new(content);
    let mut html_buf = String::new();
    pulldown_cmark::html::push_html(&mut html_buf, parser);
    let extra_class = &props.class;
    rsx! {div { id: "markdown-body", class: "prose {extra_class}", dangerous_inner_html: "{html_buf}" }}
}
