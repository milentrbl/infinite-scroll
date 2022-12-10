const postsContainer = document.getElementById('posts-container');
const loading = document.querySelector('.loader');
const filter = document.getElementById('filter');
const countEl = document.getElementById('count')

let limit = 5;
let page = localStorage.page || 1;



const findLastSection = () => {
    const number = localStorage.getItem("numberOfSection") || 1;

    const section = document.getElementById(number);

    const position = Math.round(section.offsetTop);

    scrollTo({
    top: position,
    behavior: "smooth"
    });
};

const createObserver = () => {
    const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (entry.isIntersecting) {
            localStorage.setItem("numberOfSection", entry.target.id);
        }
        });
    },
    {
        threshold: 1
    }
    );

    const sections = postsContainer.querySelectorAll(".post");
    sections.forEach((section) => observer.observe(section));
};

// Fetch posts from API

async function getPosts() {
    const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`
  );

  const data = await res.json();

  return data;
}


// Show posts in DOM
async function showPosts() {
  const posts = await getPosts();
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('post');
    // postEl.
    postEl.innerHTML = `
        <div class="number">${post.id}</div>
        <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <p class="post-body">${post.body}</p>
        </div>
    `;

    postsContainer.appendChild(postEl);

  });

}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!
findLastSection()
createObserver()


// Show loader & fetch more posts
function showLoading() {
    loading.classList.add('show');

    setTimeout(() => {
    loading.classList.remove('show');
    
    setTimeout(() => {
        page++;
        showPosts();
        localStorage.setItem('page',page)
    }, 300);
}, 1000);
}


// Filter posts by input
function filterPosts(e) {
  const term = e.target.value.toUpperCase();
  const posts = document.querySelectorAll('.post');

  posts.forEach(post => {
      const title = post.querySelector('.post-title').innerText.toUpperCase();
    const body = post.querySelector('.post-body').innerText.toUpperCase();

    if (title.indexOf(term) > -1 || body.indexOf(term) > -1) {
      post.style.display = 'flex';
    } else {
      post.style.display = 'none';
    }
  });
}
// Show initial posts
showPosts();

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    //   console.log(scrollHeight, 'scrollHeight')
    //   console.log(scrollTop, 'scrollTop')
    //   console.log(clientHeight, 'clientHeight')
    
    if (scrollHeight - scrollTop === clientHeight) {
        showLoading();
    }

});

filter.addEventListener('input', filterPosts);
countEl.addEventListener('change',()=>{
    limit = countEl.value;
    console.log(limit);
})


