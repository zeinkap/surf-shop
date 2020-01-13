// this errorHandler will handle all possible errors dealing with async
module.exports = {
    errorHandler: (fn) => 
        (req, res, next) => {
            Promise.resolve(fn(req, res, next))
                    .catch(next);   // if unhandledPromiseException or error caught, it will hand it over to express
        }
}