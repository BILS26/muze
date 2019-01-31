/* eslint disable */
const env = muze();
const DataModel = muze.DataModel;

d3.json('../../data/cars.json', (data) => {
    const jsonData = data;
    const schema = [{
        name: 'Name',
        type: 'dimension'
    },
    {
        name: 'Maker',
        type: 'dimension'
    },
    {
        name: 'Miles_per_Gallon',
        type: 'measure'
    },

    {
        name: 'Displacement',
        type: 'measure'
    },
    {
        name: 'Horsepower',
        type: 'measure'
    },
    {
        name: 'Weight_in_lbs',
        type: 'measure'
    },
    {
        name: 'Acceleration',
        type: 'measure'
    },
    {
        name: 'Origin',
        type: 'dimension'
    },
    {
        name: 'Cylinders',
        type: 'dimension'
    },
    {
        name: 'Year',
        type: 'dimension',
        subtype: 'temporal',
        format: '%Y-%m-%d'
    }
    ];

    const rootData = new DataModel(jsonData, schema);
    let rows = ['Origin'],
        columns = ['Horsepower'];
    canvas = env.data(rootData)
        .canvas()
        .rows(rows)
        .columns(columns)
        .height(400)
        // .color('Y.ear')
        .width(250)
        .minUnitWidth(140)
        // .config({
        //     axes: {
        //         x: {
        //             tickFormat: (value, rawValue, i, ticks) => value
        //         }
        //     }
        // })
        .config({
            invalidValues: {
                null: 'No Data Value is present in this particular tooltip'
            }
        })
        .subtitle('A Nice Chart')
        .title('Horsepower-Year')
    .mount('#chart');
});

