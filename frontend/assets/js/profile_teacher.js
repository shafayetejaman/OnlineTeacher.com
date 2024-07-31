// import {URLo} from "./template"
// console.log(URLo)

const URL = "https://onlineteacher-com.onrender.com";

const is_logged = () =>
{
  return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_profile_data = () =>
{

  let user_id = new URLSearchParams(window.location.search).get("user_id");
  let is_owner = false;

  console.log("hrf", user_id);

  if (!user_id && is_logged())
  {
    is_owner = true;
    user_id = localStorage.getItem("user_id");
  }
  set_nav_btn();

  console.log(user_id, is_owner);

  const url = `${URL}/accounts/teacher-list/?user__id=${user_id}`;


  fetch(url)
    .then(res => res.json())
    .then(data => display_profile(data[0], user_id, is_owner))
    .catch(err => console.error(err));
};


function set_nav_btn()
{
  if (is_logged())
  {
    document.querySelectorAll(".logged").forEach((element) =>
    {
      element.style.display = "block";
    });

    document.querySelectorAll(".not-logged").forEach((element) =>
    {
      element.style.display = "none";
    });
  }
  else
  {
    document.querySelectorAll(".logged").forEach((element) =>
    {
      element.style.display = "none";
    });

    document.querySelectorAll(".not-logged").forEach((element) =>
    {
      element.style.display = "block";
    });
  }
}

function to_12_hour_format(time)
{
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;

  if (hours === 0)
  {
    hours = 12;
  }

  return `${hours}:${minutes} ${period}`;
}


const display_profile = async (teacher, user_id, is_owner) =>
{
  console.log(teacher);

  let parent = document.getElementById("img-card");
  parent.insertAdjacentHTML("beforeend", `

            <img src="${teacher.img}" alt="Admin" class="user-img"
                  width="150">
            <div class="mt-3">
              <h4 class="text-warning">${teacher.user.username}</h4>
              <p class="text-white my-3">${teacher.description}</p>
              <a class="btn btn-info text-white">Follow</a>
              <a class="btn btn-outline-success" target="__blank" href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${teacher.user.email}">Message</a>
            </div>

        `);

  const githubLink = document.getElementById("contact-github");
  githubLink.href = teacher.github;
  githubLink.innerText = teacher.github?.slice(0, 20);

  const twitterLink = document.getElementById("contact-twitter");
  twitterLink.href = teacher.twitter;
  twitterLink.innerText = teacher.twitter?.slice(0, 20);

  const linkedinLink = document.getElementById("contact-linkedin");
  linkedinLink.href = teacher.linkedin;
  linkedinLink.innerText = teacher.linkedin?.slice(0, 20);

  const facebookLink = document.getElementById("contact-facebook");
  facebookLink.href = teacher.facebook;
  facebookLink.innerText = teacher.facebook?.slice(0, 20);


  parent = document.getElementById("teacher-detail-card");
  parent.insertAdjacentHTML("beforeend", `

            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Full Name</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.user.first_name} ${teacher.user.last_name}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Email</h6>
              </div>
              <div class="col-sm-9 text-white">
                <a class="user-links text-warning" href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${teacher.user.email}" target="__blank">${teacher.user.email}</a>
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Phone</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.phone_number}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Address</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.address}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Qualification</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.qualification.name}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Subjects</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.subjects.map(sub => `<div class='btn btn-info'>${sub.name}</div>`).join(" ")}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Available Days</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${teacher.week_days_option.map(day => `<div class='btn btn-success'>${day.name}</div>`).join(" ")}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Available Hours</h6>
              </div>
              <div class="col-sm-9 text-white">
                <div class="row text-center gap-2 gap-lg-0">
                  <div class="col-md-4">
                    <h6 class="text-white">Start</h6>
                    <span class="num text-success">${to_12_hour_format(teacher.starting_hour?.slice(0, 5))}</span>
                  </div>
                  <div class="col-md-4">
                    <h6 class="text-white">End</h6>
                    <span class="num text-success">${to_12_hour_format(teacher.ending_hour?.slice(0, 5))}</span>
                  </div>
                  <div class="col-md-4">
                    <h6 class="text-white">Hours</h6>
                    <span class="num text-success">${teacher.total_hours?.slice(0, 5)}</span>
                  </div>
                </div>
              </div>
            </div>
            ${is_owner ? `

              <hr class="text-white">
              <div class="row">
                <div class="col-sm-12">
                    <a class="btn btn-info" href="./teacher_profile_edit.html">Edit</a>
                </div>
              </div>
              ` : await is_student() ? `
              <hr class="text-white">
              <div class="row">
                <div class="col-sm-12">
                    <a class="btn btn-info" href="./take_tuition.html?user_id=${user_id}">Take Tuition</a>
                </div>
              </div>`: ""}
        `);


  display_comments(user_id, is_owner);
};

async function is_student()
{
  const student_user_id = localStorage.getItem("user_id");
  const url = `${URL}/accounts/student-list/?id=${student_user_id}`;
  let student = null;

  await fetch(url)
    .then(res => res.json())
    .then(stu => student = stu)
    .catch(err => console.error(err));

  return student?.length > 0;

}

const load_comments = async (user_id) =>
{

  const url = `${URL}/tuition/review-list/?teacher__user__id=${user_id}`;
  let comments = null;

  await fetch(url)
    .then(res => res.json())
    .then(com =>
    {
      comments = com;
      console.log(comments);
    })
    .catch(err => console.error(err));

  // sorting the comments in descending order

  comments.sort((a, b) => new Date(b.created) - new Date(a.created));

  return comments;
};

const display_comments = async (user_id, is_owner) =>
{

  const comments = await load_comments(user_id);

  document.getElementById("comments-num").innerText = `Comments: ${comments.length}`;
  const parent = document.getElementById("comment-section-list");

  comments.map(review =>
  {
    const date = new Date(review.created);
    let timestamp = date.toDateString();
    timestamp += " " + date.toLocaleTimeString();

    console.log(review);

    const url = `${URL}/accounts/student-list/?id=${review.reviewer.id}`;

    fetch(url)
      .then(res => res.json())
      .then(stu =>
      {
        student = stu[0];

        parent.insertAdjacentHTML("beforeend", `

                  <div class="be-comment my-4">
                    <div class="be-img-comment">                   
                      <img src="${student.img}" class="be-ava-comment">              
                    </div>
                    <div class="be-comment-content">
                      <span class="be-comment-name">
                        <h6 class="text-white">${student.user.username}</h6>
                      </span>
                      <span class="be-comment-time text-white">
                        <i class="far fa-clock"></i>
                        ${timestamp}
                      </span>
                      <p class="be-comment-text text-white">
                        ${review.text}
                      </p>
                      <h6>${review.rating}</h6>
                    </div>
                  </div>
        `);
      })
      .catch(err => console.error(err));

  });


  if (!is_owner && is_logged() && await has_tuition(user_id))
  {

    const parent = document.getElementById("submit-comment");
    parent.insertAdjacentHTML("beforeend", `
  
        <form class="form-block">
          <div class="row mt-5 text-center">
            <div class="col-xs-12">
             
              <div class="form-group">
                <div>
                  <span class="fs-5">Rating: </span>
                  <select class="select rounded-2 p-2 filter-color h5" id="comment-star-selection">
                    <option value="⭐">⭐</option>
                    <option value="⭐⭐">⭐⭐</option>
                    <option value="⭐⭐⭐">⭐⭐⭐</option>
                    <option value="⭐⭐⭐⭐">⭐⭐⭐⭐</option>
                    <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</option>
                  </select> 
                </div>
              
                <textarea id="comment-text" class="form-input" required placeholder="Your text"></textarea>
              </div>
              <a class="save-btn btn btn-info pull-right text-white" onclick="submit_comment(event)">submit</a>
              <div class="loading-btn btn btn-info pull-right" style="display:none;">
                <button class="btn text-white" type="button" disabled>
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Loading...
                </button>
              </div>
            </div>
          </div>
        </form>
  
      `);
  }

};

// only ongoing or completed tuition students can comment
async function has_tuition(teacher_id)
{
  const student_id = localStorage.getItem("user_id");
  const url = `${URL}/tuition/tuition-list/?student__user__id=${student_id}&teacher__user__id=${teacher_id}`;
  let tuition = null;
  let ongoing = false;

  await fetch(url)
    .then(res => res.json())
    .then(tui => tuition = tui)
    .catch(err => console.error(err));

  console.log(tuition);

  tuition.forEach(tui =>
  {
    if (tui.status == "Ongoing")
    {
      ongoing = true;
      return;
    }
  });

  return ongoing;
}

async function submit_comment(event)
{
  event.preventDefault();

  rating = document.getElementById("comment-star-selection").value;
  text = document.getElementById("comment-text").value;

  let teacher = new URLSearchParams(window.location.search).get("user_id");
  let reviewer = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");

  document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
  document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

  let url = `${URL}/accounts/teacher-list/?user__id=${teacher}`;

  await fetch(url)
    .then(res => res.json())
    .then(data =>
    {
      teacher = data[0].id;
    })
    .catch(err => console.error(err));

  url = `${URL}/accounts/student-list/?user__id=${reviewer}`;

  await fetch(url)
    .then(res => res.json())
    .then(data =>
    {
      reviewer = data[0].id;
    })
    .catch(err => console.error(err));


  const info = { rating, text, reviewer, teacher };
  console.log(info);

  url = `${URL}/tuition/review-list/`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,

      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

  window.location.reload();
};


function logout(event)
{
  event.preventDefault();

  const token = localStorage.getItem("token");
  const url = `${URL}/user-account/logout/`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,

      "Content-Type": "application/json",
    }
  }).then(res => res.json())
    .then(data =>
    {
      console.log(data);

      localStorage.removeItem("token");
      localStorage.removeItem("user_id");

      window.location.href = "./auth/login.html";
    })
    .catch(err => console.error(err));
}


load_profile_data();