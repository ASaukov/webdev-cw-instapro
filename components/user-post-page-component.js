
import { renderHeaderComponent } from "./header-component.js";
import { getToken, goToPage, posts, renderApp, setPosts, userId } from "../index.js";
import { addDislike, addLike, getUserPost, } from "../api.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { USER_POSTS_PAGE } from "../routes.js";
import { sunitizeInput } from "../helpers.js";

export function renderUserPostsPageComponent({ appEl }) {

  const appHtml = posts.map((post) => {
   
    return `
      <li class="post">
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
          <span class="user-name">${sunitizeInput(post.user.name)}</span>
          ${sunitizeInput(post.description)}
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
  <div class="post-header" data-user-id=${posts[0].user}>
            <img src=${posts[0].user.imageUrl} class="post-header__user-image">
            <p class="post-header__user-name">${posts[0].user.name}</p>
        </div>
  <ul class="posts">${appHtml}
  </ul>
  </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  })

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
            return getUserPost({ token: getToken(), id: userId})
          })
            .then((data) => {
              setPosts(data)
              renderApp()
          }) 
        }
        else{
          addDislike({id, token: getToken()})
          .then(() => {
            return getUserPost({ token: getToken(), id: userId})
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


