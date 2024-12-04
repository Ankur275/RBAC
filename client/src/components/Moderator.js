import { Link } from "react-router-dom"

const Moderator = () => {
    return (
        <section>
            <h1>Moderator Page</h1>
            <br />
            <p>You must have been assigned an moderator role.</p>
            <div className="flexGrow">
                <Link to="/">Home</Link>
            </div>
        </section>
    )
}

export default Moderator 