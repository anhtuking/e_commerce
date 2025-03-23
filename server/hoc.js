// Higher Order Function (HOC)  
// const t = 'hello'

const function_1 = (param) => {
    console.log(param + t)
}

const function_2 = (param2) => {
    console.log(param2 + t)
}

const function_hoc = (callback) => (x) => {
    const t = 'abc'
    callback(x + t)
}

// function_1('abc')
// function_2('xyz')
// function_hoc(function_1)('123')
// function_hoc(function_2)('124')

// A: function () => A("")

const Components = (props) => {
    return console.log('JSX' + props)
}

const hoc = (Component) => (props) => {
    const t = 'abc'
    return <Component {...props} t={t} />
}


