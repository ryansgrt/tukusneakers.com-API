module.exports = {
    succeed: (req, res, msg) => {
        const resObj = {
            status: 200,
            message: `Data Berhasil di${msg}`,
            data: data.length == 0 ? 'data kosong silahkan diinput baru' : data,
        }
        res.status(200).json(resObj)
    },
    errorUndified: (res) => {
        res.status(200).json({
            message: `Data Tidak Ditemukan`
        })
    },
    error: (err, res) => {
        res.status(200).json({
            message: 'Error Ditemukan',
            error: err
        })
    },
    errorNotFound: (err, res) => {
        if(data.length == 0){
            res.json({
                status: 200,
                message: 'Data tidak Ditemukan'
            })
        }
    }
}