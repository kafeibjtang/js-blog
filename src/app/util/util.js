
function getFormData(form) {
    return $(form).serializeArray().reduce((acc, { name, value }) => {

        acc[name] = value
        return acc
    },{}) 
}




export default {
    getFormData
}