import { useLocation } from "react-router-dom";
import DefaultImg from './assets/10132.jpeg'

/**
 * This is a "404 page not found" error page
 */
export function PageNotFound() {
    const { pathname } = useLocation();

    return (

        <div>
            <img
                src={DefaultImg}
                alt="left"
                style={{
                    maxWidth: "100%",
                    height: "auto",
                    margin: "auto",
                }}
            />
            <p>Sorry, we couldn't find what you're looking for! Is the path <code>{pathname}</code> correct?</p>
        </div>

    )
}

export function PatientFound() {
    return (
        <p>Sorry, we couldn't find the patient you're looking for!</p>
    )
}