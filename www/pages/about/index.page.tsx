
import React from "react";
import Markdown from 'markdown-it'
import "../../styles.css";
import content from './content.md?raw'

export function Page() {
  let html = new Markdown().render(content)
  return (
    <>
      <article className="prose prose-md prose-blue" dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}
