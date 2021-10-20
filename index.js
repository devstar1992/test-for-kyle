const axios = require('axios');
const querystring = require('querystring');


axios.get('https://raw.githubusercontent.com/Propine/2b-boilerplate/master/data/transactions.csv')
    .then(function (response) {
        // handle success
        let portfolios = [];
        const data = response.data.split('\n');
        for (let i = 1; i < data.length; i++) {
            let row = data[i].split(',');
            if (data[i]!='' && row.length==4) {
                let portfolio = portfolios.find(ele => ele.token == row[2]);
                if (portfolio) {
                    if (row[1] == 'DEPOSIT')
                        portfolio.amount += parseFloat(row[3]);
                    else
                        portfolio.amount -= parseFloat(row[3]);
                } else {
                    if (row[1] == 'DEPOSIT')
                        portfolios.push({
                            token: row[2],
                            amount: parseFloat(row[3])
                        });
                    else
                        portfolios.push({
                            token: row[2],
                            amount: -parseFloat(row[3])
                        });
                }
            }
        }

        axios.get('https://min-api.cryptocompare.com/data/pricemulti?' + querystring.stringify({
            fsyms: portfolios.reduce(function (accumulator, current) {
                return accumulator + current.token + ",";
            }, "").slice(0, -1),
            tsyms: 'USD',
            api_key: 'b779a8ab8ea47866f52ab840185dbcca2bcede5e132c10b21e0f96fc91c6213e'
        }))
            .then(function (response1) {
                portfolios = portfolios.map(ele => {
                    console.log(ele.token);
                    console.log(response1.data[ele.token]);
                    ele.amount *= parseFloat(response1.data[ele.token]['USD']);
                    return ele;
                });
                console.log('Result:');
                console.log(portfolios);
            }).catch(function (error) {
                // handle error
                console.log(error);
            });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
