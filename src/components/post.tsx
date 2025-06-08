import React from 'react';
import { generateHTML } from '@tiptap/html';
import { JSONContent } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

type Props = {
  post: {
    title: string;
    content: JSONContent;
    tags?: string[];
  };
};

const Post: React.FC<Props> = ({ post }) => {
  return (
    <main>
      <article itemScope itemType='https://schema.org/Article'>
        <header>
          <h1 itemProp='headline'>{post.title}</h1>
        </header>

        <section itemProp='articleBody'>{generateHTML(post.content, [StarterKit])}</section>

        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <footer>
            <h2>Tags</h2>
            <ul>
              {post.tags?.map((tag, idx) => (
                <li key={idx}>
                  <a href={`/tags/${encodeURIComponent(tag)}`} rel='tag'>
                    {tag}
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        )}
      </article>
    </main>
  );
};

export default Post;
