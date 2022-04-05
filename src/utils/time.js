module.exports = (time) => {
    const [date, month, year] = new Date(time).toLocaleDateString("uz-UZ").split("/")
    const [hour, minute] = new Date(time).toLocaleTimeString("uz-UZ").split(/:| /)  
    
    return `${date}/${month}/${year} | ${hour}:${minute}`
}