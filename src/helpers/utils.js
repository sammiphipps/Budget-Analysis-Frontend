export const parseAmount = (amount) => {
    return parseFloat(amount.replace(/(^\$|,)/g,''))
}

export const sortByDate = (array) => {
    return array.sort((a, b) => {
        const shortMonthName = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        const splitADate = a.month.split(" ")
        const splitBDate = b.month.split(" ")
        const newADate = new Date(splitADate[1], shortMonthName.indexOf(splitADate[0].toLowerCase()), 1)
        const newBDate = new Date(splitBDate[1], shortMonthName.indexOf(splitBDate[0].toLowerCase()), 1)
        return newADate > newBDate ? 1 : -1
    })    
}