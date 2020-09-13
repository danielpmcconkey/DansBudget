module.exports = {


    multiSort: function (listOfItems, sortParam, sortAscending) {

        if (listOfItems.length < 2) return listOfItems;
        if (sortParam === "balance" && sortAscending === true)
            return listOfItems.sort(function (a, b) {
                if (a.balance < b.balance) return -1; else if (a.balance > b.balance) return 1; else return 0;
            });
        if (sortParam === "balance" && sortAscending === false)
            return listOfItems.sort(function (a, b) {
                if (a.balance < b.balance) return 1; else if (a.balance > b.balance) return -1; else return 0;
            });
        if (sortParam === "nickName" && sortAscending === true)
            return listOfItems.sort(function (a, b) {
                if (a.nickName.toLowerCase() < b.nickName.toLowerCase()) return -1; else if (a.nickName.toLowerCase() > b.nickName.toLowerCase()) return 1; else return 0;
            });
        if (sortParam === "nickName" && sortAscending === false)
            return listOfItems.sort(function (a, b) {
                if (a.nickName.toLowerCase() < b.nickName.toLowerCase()) return 1; else if (a.nickName.toLowerCase() > b.nickName.toLowerCase()) return -1; else return 0;
            });
        if (sortParam === "rate" && sortAscending === true)
            return listOfItems.sort(function (a, b) {
                if (a.rate < b.rate) return -1; else if (a.rate > b.rate) return 1; else return 0;
            });
        if (sortParam === "rate" && sortAscending === false)
            return listOfItems.sort(function (a, b) {
                if (a.rate < b.rate) return 1; else if (a.rate > b.rate) return -1; else return 0;
            });
    }
}