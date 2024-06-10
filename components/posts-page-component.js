import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, setPosts, renderApp, getToken } from "../index.js";
import { addDislike, addLike, getPosts } from "../api.js";
import { ru } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";

export function renderPostsPageComponent({ appEl }) {

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((post) => {
    return `
      <li class="post">
        <div class="post-header" data-user-id=${post.user.id}>
            <img src=${post.user.imageUrl} class="post-header__user-image">
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src=${post.imageUrl}>
        </div>
        <div class="post-likes">
          <button data-post-id=${post.id} data-liked=${post.isLiked} class="like-button">
            <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length === 0 ? 0 : post.likes.length === 1 
              ? post.likes[0].name : post.likes[post.likes.length - 1].name + " и ещё " + (post.likes.length - 1)}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
         ${formatDistanceToNow(new Date(post.createdAt), {locale: ru})} назад
        </p>
      </li>
    `;
  })
  .join('');
           

  appEl.innerHTML = `<div class="page-container">
  <div class="header-container"></div>
  <ul class="posts">${appHtml}
  </ul>
  </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }


function likes() {
  const likeButtonElements = document.querySelectorAll(".like-button");
  for(const likeButtonElement of likeButtonElements) {
    likeButtonElement.addEventListener('click', (e) => {

      e.stopPropagation();
      const id = likeButtonElement.dataset.postId;
      const isLiked = likeButtonElement.dataset.liked;
      
      if(isLiked === "false") {
        addLike({id, token: getToken()})
        .then(() => {
          return getPosts({token: getToken()})
        })
          .then((data) => {
            setPosts(data)
            renderApp()
        }) 
      }
      else{
        addDislike({id, token: getToken()})
        .then(() => {
          return getPosts({token: getToken()})
        })
          .then((data) => {
            setPosts(data)
            renderApp()
        }) 
      }
    })
  }
  }
  likes()
}

