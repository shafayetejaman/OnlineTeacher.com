const URL = "http://127.0.0.1:8000";

const is_logged = () =>
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_admin_page = async () =>
{
    document.title = "Admin Panel";

    let is_admin = false;
    const user_id = localStorage.getItem("user_id");
    const url = `${URL}/accounts/user-list/?id=${user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => is_admin = data[0].is_superuser)
        .catch(err => console.error(err));


    if (!(is_logged && is_admin))
    {
        window.location.href = "index.html";
    }
    set_nav_btn();
    load_tuitions();
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


const load_tuitions = (search = "") =>
{
    const url = `${URL}/tuition/tuition-list/?search=${search}`;

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
                    <td>${tuition.student.user.username}</td>
                    <td>${tuition.subjects.map(sub => sub.name).join(", ")}</td>
                    <td>${tuition.status}</td>
                    <td>${tuition.type}</td>
                    <td>${tuition.canceled ? '✅' : `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                  <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"></path><path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"></path>
                    </svg>`}
                    </td>
                    <td>${tuition.description}</td>
                    <td>${tuition.created.slice(0, 10)}</td>
                    <td>
                    <ul class="action-list" id="action-list-${tuition.id}">
                    ${tuition.canceled ? '' : `
                    
                    <li><a href="" id="${tuition.id}" onclick="cancel_tuition(event,id)" data-tip="cancel"><i class="fa-solid fa-bucket text-warning"></i></a></li>

                    `}
                    
                    <li><a href="" id="${tuition.id}" onclick="edit_tuition(event,id)" data-tip="edit"><i class="fa-solid fa-edit"></i></a></li>
                    
                    </ul>
                    </td>
                    </tr>
                    
                    `);

                if (tuition.status == "Pending" && !tuition.canceled)
                {
                    parent = document.getElementById(`action-list-${tuition.id}`);
                    parent.insertAdjacentHTML("afterbegin", `
    
                         <li><a href="" id="${tuition.id}" onclick="approve_tuition(event,id)" data-tip="approve"><i class="fa-solid fa-circle-check h6 text-success"></i></a></li>
                         
                        `);
                }

            });
        });
};


async function approve_tuition(event, id)
{
    event.preventDefault();
    if (!confirm("Do you really want to approve this tuition?")) return;

    const url = `${URL}/tuition/update/${id}`;
    const token = localStorage.getItem('token');
    const info = {

        user_id: localStorage.getItem("user_id"),
        status: "Ongoing"
    };

    document.querySelectorAll(".action-list").forEach(div => div.style.display = "none");

    await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)

    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    window.location.reload();
}

function edit_tuition(event, id)
{
    event.preventDefault();

    window.location.href = `tuition_edit.html?id=${id}`;
}

function search_tuition()
{
    document.getElementById("tuition-table").innerHTML = "";

    const search = document.querySelector("#search-bar").value;
    load_tuitions(search);
}

async function cancel_tuition(event, id)
{
    event.preventDefault();
    if (!confirm("Do you really want to cancel the tuition?")) return;

    const url = `${URL}/tuition/cancel/`;
    const token = localStorage.getItem('token');
    const info = {
        id,
        user_id: localStorage.getItem("user_id")
    };

    fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)

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

load_admin_page();