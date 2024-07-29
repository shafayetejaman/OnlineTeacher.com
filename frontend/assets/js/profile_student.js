const URL = "https://main--online-teacher-com.netlify.app";

const is_logged = () =>
{
  return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_profile_data = () =>
{

  if (!is_logged)
  {
    window.location.href = "./auth/login.html";
  }
  set_nav_btn();

  const user_id = localStorage.getItem("user_id");
  const url = `${URL}/accounts/student-list/?user__id=${user_id}`;


  fetch(url)
    .then(res => res.json())
    .then(data =>
    {
      console.log(data);
      display_profile(data[0], user_id);
    })
    .catch(err => console.error(err));

  document.getElementById('search-bar').addEventListener('keydown', event =>
  {
    if (event.key === 'Enter')
    {
      event.preventDefault();
      document.getElementById('search-btn').click();
    }
  });

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

const display_profile = async (student, user_id) =>
{
  // console.log(teacher)

  let parent = document.getElementById("img-card");
  parent.insertAdjacentHTML("beforeend", `

            <img src="${student.img}" alt="Admin" class="user-img"
                  width="150">
            <div class="mt-3">
              <h4 class="text-warning">${student.user.username}</h4>
              <p class="text-white fs-6">Educational level: ${student.current_class}</p>
              <p class="student-card-description text-white pb-lg-2">${student.description}</p>
              <a class="btn btn-info" target="__blank" href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${student.user.email}">Message</a>
            </div>

            `);


  parent = document.getElementById("teacher-detail-card");
  parent.insertAdjacentHTML("beforeend", `

            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Full Name</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${student.user.first_name} ${student.user.last_name}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Email</h6>
              </div>
              <div class="col-sm-9">
                <a class="user-links text-warning" href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${student.user.email}" target="__blank">${student.user.email}</a>
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Phone</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${student.phone_number}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-3">
                <h6 class="mb-0 text-white">Address</h6>
              </div>
              <div class="col-sm-9 text-white">
                ${student.address}
              </div>
            </div>
            <hr class="text-white">
            <div class="row">
              <div class="col-sm-12">
                  <a class="btn btn-info" href="./student_profile_edit.html">Edit</a>
              </div>
            </div>

       `);

  load_tuitions(user_id);

};

const load_tuitions = (user_id, search = "") =>
{
  let url = `${URL}/tuition/tuition-list/?student__user__id=${user_id}&search=${search}`;

  fetch(url)
    .then(res => res.json())
    .then(tuitions =>
    {
      console.log(tuitions);

      tuitions.map(tuition =>
      {

        let parent = document.getElementById("tuition-table");
        parent.insertAdjacentHTML("beforeend", `

                <tr> 
                <td>${tuition.id}</td>
                <td>${tuition.teacher.user.username}</td>
                <td>${tuition.subjects.map(sub => sub.name).join(", ")}</td>
                <td>${tuition.status}</td>
                <td>${tuition.type}</td>
                <td>${tuition.canceled ? '✅' : `
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                  <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                    </svg>
                    `}
                    </td>
                    <td>${tuition.created.slice(0, 10)}</td>
                    <td>
                    <ul class="action-list">
                    ${tuition.canceled ? '' : `

                      <li><a href="" id="${tuition.id}" onclick="cancel_tuition(event,id)" data-tip="cancel"><i class="fa-solid fa-bucket"></i></a></li>
                    `}


                    </ul>
                  </td>
                </tr>

            `);
      });
    });
};

function search_tuition()
{
  document.getElementById("tuition-table").innerHTML = "";
  const user_id = localStorage.getItem('user_id');
  const search = document.querySelector("#search-bar").value;

  load_tuitions(user_id, search);
}

async function cancel_tuition(event, id)
{
  event.preventDefault();

  if (!confirm("Do you really want to cancel you tuition?")) return;

  const url = `${URL}/tuition/cancel/`;
  const token = localStorage.getItem('token');

  fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })

  }).then(res => res.json())
    .then(data =>
    {
      console.log(data);
      alert(data.error ? data.error : data);
      window.location.reload();

    }).catch(err => console.error(err));

}


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