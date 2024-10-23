// import {URLo} from "./template"
// console.log(URLo)

const URL = "https://onlineteacher-com.onrender.com";
const IMG_HIPPO_API_KEY = "LI13eY0MqVCFIFPo9Ifw33Sx4zG9I9nv";
const PROXY_CORE_API_KEY = "temp_ee17654e67a694852277c7cb354b8fd7";
const DEFAULT_IMG = "https://i.imghippo.com/files/I9WYK1721756674.png";

let Student = null;
let UploadImg = null;

function is_logged()
{
    return localStorage.getItem( "token" ) && localStorage.getItem( "user_id" );
}

async function get_student_data( user_id )
{
    let student = null;

    const url = `${URL}/accounts/student-list/?user__id=${user_id}`;

    await fetch( url )
        .then( res => res.json() )
        .then( data =>
        {
            student = data[ 0 ];
            // console.log(student)
        } )
        .catch( err => console.error( err ) );

    return student;
}


function set_nav_btn()
{
    if ( is_logged() )
    {
        document.querySelectorAll( ".logged" ).forEach( ( element ) =>
        {
            element.style.display = "block";
        } );

        document.querySelectorAll( ".not-logged" ).forEach( ( element ) =>
        {
            element.style.display = "none";
        } );
    }
    else
    {
        document.querySelectorAll( ".logged" ).forEach( ( element ) =>
        {
            element.style.display = "none";
        } );

        document.querySelectorAll( ".not-logged" ).forEach( ( element ) =>
        {
            element.style.display = "block";
        } );
    }
}

function logout( event )
{
    event.preventDefault();
    console.log( "logout.." );

    const token = localStorage.getItem( "token" );

    const url = `${URL}/user-account/logout/`;

    fetch( url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,

            "Content-Type": "application/json",
        }
    } ).then( res => res.json() )
        .then( data =>
        {
            console.log( data );
            localStorage.removeItem( "token" );
            localStorage.removeItem( "user_id" );
            window.location.href = "index.html";
        } )
        .catch( err => console.error( err ) );

}


function display_user_profile( student )
{
    console.log( student );
    document.querySelector( ".user-img" ).src = student.img;

    // setting all the user data
    document.getElementById( "phone_number" ).value = student.phone_number;
    document.getElementById( "description" ).value = student.description;
    document.getElementById( "address" ).value = student.address;
    document.getElementById( "current_class" ).value = student.current_class;
}


function set_user_data( id )
{
    const url = `${URL}/accounts/user-list/?id=${id}`;

    fetch( url )
        .then( res => res.json() )
        .then( data =>
        {
            const user = data[ 0 ];

            document.getElementById( "username" ).innerText = user.username;
            document.getElementById( "first_name" ).value = user.first_name;
            document.getElementById( "last_name" ).value = user.last_name;
            document.getElementById( "email" ).value = user.email;

        } )
        .catch( err => console.error( err ) );

}

async function update_student( event )
{
    event.preventDefault();
    const user_id = localStorage.getItem( "user_id" );

    const phone_number = document.getElementById( "phone_number" ).value;
    const description = document.getElementById( "description" ).value;
    const address = document.getElementById( "address" ).value;
    const current_class = document.getElementById( "current_class" ).value;
    const email = document.getElementById( "email" ).value;
    console.log( UploadImg );

    const info = {
        user: user_id,
        img: UploadImg ? UploadImg : ( Student ? Student.img : DEFAULT_IMG ),
        phone_number,
        current_class,
        description,
        address,
        email,
    };

    console.log( info );
    document.querySelectorAll( ".save-btn" ).forEach( btn => btn.style.display = "none" );
    document.querySelectorAll( ".loading-btn" ).forEach( btn => btn.style.display = "block" );


    if ( Student )
    {
        const url = `${URL}/accounts/update-student/${Student.id}`;
        const token = localStorage.getItem( "token" );

        await fetch( url, {
            method: "PUT",
            headers: {
                Authorization: `Token ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify( info )
        }
        ).then( res => res.json() )
            .then( data => console.log( data ) )
            .catch( err => console.error( err ) );
    }
    else
    {
        const url = `${URL}/accounts/student-list/`;
        const token = localStorage.getItem( "token" );

        await fetch( url, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
                "content-type": "application/json"
            },
            body: JSON.stringify( info )
        }
        ).then( res => res.json() )
            .then( data => console.log( data ) )
            .catch( err => console.error( err ) );
    }

    document.querySelectorAll( ".save-btn" ).forEach( btn => btn.style.display = "block" );
    document.querySelectorAll( ".loading-btn" ).forEach( btn => btn.style.display = "none" );

    window.location.href = "profile_student.html";
}


async function load_page()
{
    if (!is_logged())
    {
        window.location.href = "index.html";
    }
    set_nav_btn();

    const user_id = localStorage.getItem( "user_id" );
    const student = await get_student_data( user_id );

    set_user_data( user_id );

    if ( student )
    {
        document.querySelector( ".change-password-section" ).style.display = "block";
        // insert user data
        Student = student;
        display_user_profile( student );
    }

    const file = document.getElementById( "img" );

    file.addEventListener( "change", async ( event ) =>
    {
        document.querySelectorAll( ".save-btn" ).forEach( btn => btn.style.display = "none" );
        document.querySelectorAll( ".loading-btn" ).forEach( btn => btn.style.display = "block" );

        const form = new FormData();
        form.append( "file", event.target.files[ 0 ] );

        await fetch( `https://proxy.cors.sh/https://www.imghippo.com/v1/upload?api_key=${IMG_HIPPO_API_KEY}`, {
            method: 'POST',
            headers: {
                'x-cors-api-key': PROXY_CORE_API_KEY
            },
            body: form

        } ).then( res => res.json() )
            .then( data =>
            {
                console.log( data );
                UploadImg = data.data.view_url;
            } )
            .catch( err => console.error( err ) );

        document.querySelectorAll( ".save-btn" ).forEach( btn => btn.style.display = "block" );
        document.querySelectorAll( ".loading-btn" ).forEach( btn => btn.style.display = "none" );

    } );


}

function change_password( event )
{
    event.preventDefault();

    const old_password = document.getElementById( "old_password" ).value;
    const new_password = document.getElementById( "new_password" ).value;
    const confirm_new_password = document.getElementById( "confirm_new_password" ).value;

    const url = `${URL}/user-account/change-password/`;
    const token = localStorage.getItem( "token" );

    if ( new_password == confirm_new_password )
    {
        if ( /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/.test( new_password ) )
        {
            const info = {
                username: Student.user.username,
                old_password,
                new_password,
                confirm_new_password
            };

            console.log( info );
            document.querySelectorAll( ".save-btn" ).forEach( btn => btn.style.display = "none" );
            document.querySelectorAll( ".loading-btn" ).forEach( btn => btn.style.display = "block" );

            fetch( url, {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify( info )
            }
            ).then( res => res.json() )
                .then( data =>
                {
                    console.log( data );
                    if ( data?.error )
                    {
                        alert( data.error );
                        document.getElementById( 'old_password' ).value = "";
                        document.getElementById( 'new_password' ).value = "";
                    }
                    else
                    {
                        logout( event );
                    }
                } )
                .catch( err => console.error( err ) );
        }
        else
        {

            document.getElementById( 'old_password' ).value = "";
            document.getElementById( 'new_password' ).value = "";
            document.getElementById( 'confirm_new_password' ).value = "";
            alert( "Password must contain eight characters, at least one letter, one number and one special character!" );
        }
    }
    else
    {
        document.getElementById( 'old_password' ).value = "";
        document.getElementById( 'new_password' ).value = "";
        document.getElementById( 'confirm_new_password' ).value = "";
        alert( "Password and confirm password does not match!" );
    }
}

function logout( event )
{
    event.preventDefault();

    const token = localStorage.getItem( "token" );
    const url = `${URL}/user-account/logout/`;

    fetch( url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,

            "Content-Type": "application/json",
        }
    } ).then( res => res.json() )
        .then( data =>
        {
            console.log( data );

            localStorage.removeItem( "token" );
            localStorage.removeItem( "user_id" );

            window.location.href = "./auth/login.html";
        } )
        .catch( err => console.error( err ) );
}

load_page();