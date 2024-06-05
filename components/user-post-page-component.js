import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

export function renderUserPostsPageComponent({ appEl }) {


  const appHtml = posts.map((post) => {
    return `
      <li class="post">
        
        <div class="post-image-container">
          <img class="post-image" src=${post.imageUrl}>
        </div>
        <div class="post-likes">
          <button data-post-id="642d00579b190443860c2f32" class="like-button">
            <img src="./assets/images/like-active.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>2</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
          19 минут назад
        </p>
      </li>
    `;
  })
  .join('');
           

  appEl.innerHTML = `<div class="page-container">
  <div class="header-container"></div>
  <div class="post-header" data-user-id=${posts[0].user.id}>
            <img src=${posts[0].user.imageUrl} class="post-header__user-image">
            <p class="post-header__user-name">${posts[0].user.name}</p>
        </div>
  <ul class="posts">${appHtml}
  </ul>
  </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
}


