// import {URLo} from "./template"
// console.log(URLo)

const URL = "https://onlineteacher-com.onrender.com";
// const IMG_HIPPO_API_KEY = "LI13eY0MqVCFIFPo9Ifw33Sx4zG9I9nv";
// const PROXY_CORE_API_KEY = "temp_ee17654e67a694852277c7cb354b8fd7";
// const DEFAULT_IMG = "https://online-teacher-com.netlify.app/assets/img/static/default_user.png";

let Student = null;
// let UploadImg = null;
const Form = new FormData();

function is_logged()
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
}


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

async function get_teacher_data(user_id)
{
    let teacher = null;

    const url = `${URL}/accounts/teacher-list/?user__id=${user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            teacher = data[0];
            // console.log(teacher)
        })
        .catch(err => console.error(err));

    return teacher;
}


function logout(event)
{
    event.preventDefault();
    console.log("logout..");

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
            window.location.href = "index.html";
        })
        .catch(err => console.error(err));

}

async function load_page_data()
{
    set_nav_btn();
    // loading subjects
    let url = `${URL}/accounts/subject-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.map(sub =>
            {
                const parent = document.getElementById('subjects');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${sub.id}">${sub.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));

    // load qualification
    url = `${URL}/accounts/qualification-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.map(qua =>
            {
                const parent = document.getElementById('qualification');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${qua.id}">${qua.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));

    // Available days
    url = `${URL}/accounts/day-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.map(day =>
            {
                const parent = document.getElementById('week_days_option');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${day.id}">${day.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));

}

function display_user_profile(teacher)
{
    console.log(teacher);
    document.querySelector(".user-img").src = teacher.img;

    // setting all the user data
    document.getElementById("phone_number").value = teacher.phone_number;
    document.getElementById("description").value = teacher.description;
    document.getElementById("address").value = teacher.address;
    document.getElementById("salary").value = teacher.salary;
    document.getElementById("starting_hour").value = teacher.starting_hour;
    document.getElementById("ending_hour").value = teacher.ending_hour;
    document.getElementById("total_hours").value = teacher.total_hours.slice(0, 5);
    document.getElementById("github").value = teacher.github;
    document.getElementById("facebook").value = teacher.facebook;
    document.getElementById("linkedin").value = teacher.linkedin;
    document.getElementById("twitter").value = teacher.twitter;
    document.getElementById("qualification").value = teacher.qualification.id;

    // selecting all the subjects for the teacher
    teacher.subjects.forEach(sub =>
    {
        document.querySelector(`#subjects option[value="${sub.id}"]`).selected = true;
    });

    // selecting all the subjects for the teacher
    teacher.week_days_option.map(day =>
    {
        document.querySelector(`#week_days_option option[value="${day.id}"]`).selected = true;
    });
}

function set_user_data(id)
{
    const url = `${URL}/accounts/user-list/?id=${id}`;

    fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            const user = data[0];

            document.getElementById("username").innerText = user.username;
            document.getElementById("first_name").value = user.first_name;
            document.getElementById("last_name").value = user.last_name;
            document.getElementById("email").value = user.email;

        })
        .catch(err => console.error(err));

}

function is_valid_time(time)
{
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
}

async function update_teacher(event)
{
    event.preventDefault();
    const user_id = localStorage.getItem("user_id");
    const total_hours = document.getElementById("total_hours").value;

    if (!is_valid_time(total_hours))
    {
        alert("Invalid Time Format!");
        document.getElementById("total_hours").value = "";
        return;
    }

    const phone_number = document.getElementById("phone_number").value;
    const description = document.getElementById("description").value;
    const address = document.getElementById("address").value;
    const salary = document.getElementById("salary").value;
    const starting_hour = document.getElementById("starting_hour").value;
    const ending_hour = document.getElementById("ending_hour").value;
    const github = document.getElementById("github").value;
    const facebook = document.getElementById("facebook").value;
    const linkedin = document.getElementById("linkedin").value;
    const twitter = document.getElementById("twitter").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const qualification = document.getElementById("qualification").value;

    let selected = document.querySelectorAll("#subjects option:checked");
    const subjects = Array.from(selected).map(sub => sub.value);

    selected = document.querySelectorAll("#week_days_option option:checked");
    const week_days_option = Array.from(selected).map(day => parseInt(day.value));

    // const info = {
    //     user: user_id,
    //     img: UploadImg ? UploadImg : (Teacher ? Teacher.img : DEFAULT_IMG),
    //     phone_number,
    //     description,
    //     address,
    //     starting_hour,
    //     ending_hour,
    //     total_hours,
    //     github: github ? github : "#",
    //     facebook: facebook ? facebook : "#",
    //     linkedin: linkedin ? linkedin : "#",
    //     twitter: twitter ? twitter : "#",
    //     qualification,
    //     first_name,
    //     last_name,
    //     email,
    //     subjects,
    //     week_days_option,
    // };

    // console.log(info);

    document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
    document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

    // if (Teacher)
    // {
    //     const url = `${URL}/accounts/update-teacher/${Teacher.id}`;
    //     const token = localStorage.getItem("token");

    //   await fetch(url, {
    //         method: "PUT",
    //         headers: {
    //             Authorization: `Token ${token}`,
    //             "content-type": "application/json"
    //         },
    //         body: JSON.stringify(info)
    //     }
    //     ).then(res => res.json())
    //         .then(data => console.log(data))
    //         .catch(err => console.error(err));
    // }
    // else
    // {
    //     const url = `${URL}/accounts/teacher-list/`;
    //     const token = localStorage.getItem("token");

    //    await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Token ${token}`,
    //             "content-type": "application/json"
    //         },
    //         body: JSON.stringify(info)
    //     }
    //     ).then(res => res.json())
    //         .then(data => console.log(data))
    //         .catch(err => console.error(err));
    // }

    Form.append("user", user_id);
    Form.append("phone_number", phone_number);
    Form.append("description", description);
    Form.append("address", address);
    Form.append("salary", salary);
    Form.append("starting_hour", starting_hour);
    Form.append("ending_hour", ending_hour);
    Form.append("github", github || "#");
    Form.append("facebook", facebook || "#");
    Form.append("linkedin", linkedin || "#");
    Form.append("twitter", twitter || "#");
    Form.append("first_name", first_name);
    Form.append("last_name", last_name);
    Form.append("email", email);
    Form.append("qualification", qualification);
    Form.append("total_hours", total_hours);

    subjects.forEach(sub => Form.append("subjects", sub)); 
    week_days_option.forEach(day => Form.append("week_days_option", day)); 

    const url = Teacher ? `${URL}/accounts/update-teacher/${Teacher.id}` : `${URL}/accounts/teacher-list/`;
    const token = localStorage.getItem("token");
    console.log(Form.get("su"))

    await fetch(url, {
        method: Teacher ? "PUT" : "POST",
        headers: {
            Authorization: `Token ${token}`

        },
        body: Form
    })
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);
        })
        .catch(err => console.error(err));

    document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "block");
    document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "none");

    window.location.href = "profile_teacher.html";
}


async function load_page()
{

    if (!is_logged())
    {
        window.location.href = "index.html";
    }

    const user_id = localStorage.getItem("user_id");

    await load_page_data();
    const teacher = await get_teacher_data(user_id);

    set_user_data(user_id);

    if (teacher)
    {
        document.querySelector(".change-password-section").style.display = "block";
        // insert user data
        Teacher = teacher;
        display_user_profile(teacher);
    }

    const file = document.getElementById("img");

    file.addEventListener("change", async (event) =>
    {
        document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
        document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

        Form.append("img", event.target.files[0]);


        // await fetch( `https://proxy.cors.sh/https://www.imghippo.com/v1/upload?api_key=${IMG_HIPPO_API_KEY}`, {
        //     method: 'POST',
        //     headers: {
        //         'x-cors-api-key': PROXY_CORE_API_KEY
        //     },
        //     body: form

        // } ).then( res => res.json() )
        //     .then( data =>
        //     {
        //         console.log( data );
        //         UploadImg = data.data.view_url;
        //     } )
        //     .catch( err => console.error( err ) );

        document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "block");
        document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "none");

    });
}

function change_password(event)
{
    event.preventDefault();

    const old_password = document.getElementById("old_password").value;
    const new_password = document.getElementById("new_password").value;
    const confirm_new_password = document.getElementById("confirm_new_password").value;

    const url = `${URL}/user-account/change-password/`;
    const token = localStorage.getItem("token");

    if (new_password == confirm_new_password)
    {
        if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test(new_password))
        {
            const info = {
                username: Teacher.user.username,
                old_password,
                new_password,
                confirm_new_password
            };

            console.log(info);

            document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
            document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

            fetch(url, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify(info)
            }
            ).then(res => res.json())
                .then(data =>
                {
                    if (data?.error)
                    {
                        alert(data.error);
                        document.getElementById('old_password').value = "";
                        document.getElementById('new_password').value = "";
                    }
                    else
                    {
                        logout(event);
                    }
                })
                .catch(err => console.error(err));
        }
        else
        {

            document.getElementById('old_password').value = "";
            document.getElementById('new_password').value = "";
            document.getElementById('confirm_new_password').value = "";
            alert("Password must contain eight characters, at least one letter, one number and one special character!");
        }
    }
    else
    {
        document.getElementById('old_password').value = "";
        document.getElementById('new_password').value = "";
        document.getElementById('confirm_new_password').value = "";
        alert("Password and confirm password does not match!");
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

load_page();