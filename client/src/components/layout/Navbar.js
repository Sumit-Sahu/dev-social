import React from 'react'

const Navbar = () => {
    return (
        <div>
            <div>
                <nav class="navbar bg-dark">
                    <h1>
                        <a href="index.html"><i class="fa fa-code"></i> DevConnector</a>
                    </h1>
                    <ul>
                        <li><a href="profiles.html">Developers</a></li>
                        <li><a href="register.html">Register</a></li>
                        <li><a href="login.html">Login</a></li>
                    </ul>
                </nav>                
            </div>
        </div>
    )
}

export default Navbar

