const URL = "https://onlineteacher-com.onrender.com";;

const load_teachers = () =>
{

  document.getElementById("no-data-img").style.display = "none";
  document.getElementById("loading-spinner").style.display = "block";
  document.getElementById("teacher-cards-div").innerHTML = "";

  const search = document.getElementById("search_bar").value;
  document.getElementById("search_bar").value = "";

  const qualification = document.getElementById("teacher-qualification").value;
  const starting_hour = document.getElementById("starting-hour").value;
  const ending_hour = document.getElementById("ending-hour").value;

  let selected = document.querySelectorAll('#subjects option:checked');
  const subjects = Array.from(selected).map(sub => sub.value);

  selected = document.querySelectorAll('#week_days_option input:checked');
  const week_days_option = Array.from(selected).map(sub => sub.value);


  let url = `${URL}/accounts/teacher-list/?search=${search}&qualification=${qualification}&starting_hour__gte=${starting_hour}&ending_hour__lte=${ending_hour}`;

  subjects.map(sub => url += '&subjects=' + sub);
  week_days_option.map(day => url += '&week_days_option=' + day);

  console.log(url);
  fetch(url)
    .then(res => res.json())
    .then(data => display_teacher_cards(data))
    .catch(err => console.error(err));
};


const load_teachers_filter = async () =>
{
  let url = `${URL}/accounts/qualification-list/`;
  let qualification = null;

  await fetch(url)
    .then(res => res.json())
    .then(data => qualification = data)
    .catch(err => console.error(err));

  let div = document.getElementById("teacher-qualification");

  qualification?.forEach(qua =>
  {
    div.insertAdjacentHTML("beforeend", `
    
        <option value="${qua.id}">${qua.name}</option>

        `);
  });

  url = `${URL}/accounts/day-list/`;
  let days = null;

  await fetch(url)
    .then(res => res.json())
    .then(data => days = data)
    .catch(err => console.error(err));

  div = document.getElementById("week_days_option");

  days?.forEach(day =>
  {
    div.insertAdjacentHTML("beforeend", `

          <input type="checkbox" class="btn-check" id="${day.id}" autocomplete="off" value="${day.id}">
          <label class="circle-btn btn btn-outline-primary border-0 filter-color rounded-circle fs-6 fw-bolder m-1"
            for="${day.id}">${day.name.slice(0, 2)}</label>
        
        `);
  });

  url = `${URL}/accounts/subject-list/`;
  let subjects = null;

  await fetch(url)
    .then(res => res.json())
    .then(data => subjects = data)
    .catch(err => console.error(err));

  div = document.getElementById("subjects");

  subjects?.forEach(sub =>
  {
    div.insertAdjacentHTML("beforeend", `

          <option value="${sub.id}">${sub.name}</option>
        
        `);
  });

};

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

const display_teacher_cards = (data) =>
{

  document.getElementById("loading-spinner").style.display = "none";
  console.log(data);

  if (data?.length == 0)
  {
    document.getElementById("no-data-img").style.display = "block";
  }
  else
  {
    document.getElementById("no-data-img").style.display = "none";
  }

  data?.forEach(teacher =>
  {

    const parent = document.getElementById("teacher-cards-div");
    parent.insertAdjacentHTML("beforeend", `

        <div class="col card p-3 py-4">
          <div class="text-center">
            <img src="${teacher.img}" class="teacher-card-img bg-white">
            <h4 class="mt-4 mb-3">${teacher.user.first_name + " " + teacher.user.last_name}</h4>
            <span class="clearfix">Qualification: ${teacher.qualification.name}</span>

            <div class="row mt-3 gap-2 gap-lg-0">

              <div class="col-md-4">
                <h5>Start</h5>
                <span class="num">${to_12_hour_format(teacher.starting_hour)}</span>
              </div>
              <div class="col-md-4">
                <h5>End</h5>
                <span class="num">${to_12_hour_format(teacher.ending_hour)}</span>
              </div>
              <div class="col-md-4">
                <h5>Hours</h5>
                <span class="num">${teacher.total_hours.slice(0, 5)}</span>
              </div>

            </div>

            <hr class="line">

            <small class="mt-4">${teacher.description.slice(0, 70)}${teacher.description.length > 70 ? "..." : ""}</small>
            <div class="social-buttons mt-5">
              <a href="${teacher.facebook}" target="__blank" class="text-decoration-none"><button class="neo-button"><i
                    class="facebook-icon lni lni-facebook-filled"></i></button></a>
              <a href="${teacher.linkedin}" target="__blank" class="text-decoration-none"><button class="neo-button"><i
                    class="linkedin-icon lni lni-linkedin-original"></i></button></a>
              <a href="${teacher.github}" target="__blank" class="text-decoration-none"><button class="neo-button"><i 
                    class="fa-brands fa-github"></i></button></a>
              <a href="${teacher.twitter}" target="__blank" class="text-decoration-none"><button class="neo-button"><i
                    class="twitter-icon lni lni-twitter-filled"></i> </button></a>
            </div>

            <div class="profile mt-5">

              <a href="./profile_teacher.html?user_id=${teacher.user.id}"><button class="profile_button px-5">View profile</button></a>

            </div>

          </div>
        </div>

      `);
  });
};

const is_logged = () =>
{
  return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_course = () =>
{
  let url = `${URL}/tuition/course-list/`;

  fetch(url)
    .then(res => res.json())
    .then(data =>
    {
      data?.forEach(course =>
      {
        const parent = document.querySelector(".pricing-active");

        // TODO add courses

      });
    })
    .catch(err => console.error(err));



};

const load_home_page = () =>
{
  document.getElementById("no-data-img").style.display = "none";
  document.getElementById("loading-spinner").style.display = "none";

  load_teachers();
  load_teachers_filter();
  load_course();
  set_nav_btn();

  // adding enter to search feature
  document.getElementById('search_bar').addEventListener('keydown', event =>
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

//  TODO send get in touch email
function send_email(event)
{
  event.preventDefault();
}

load_home_page();