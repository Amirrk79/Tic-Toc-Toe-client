import actionTypeMaker from "../helpers/actionTypeMaker"

export default function enterName(data) {
    return {
        type: actionTypeMaker.enterName(),
        payload: data
    }
}