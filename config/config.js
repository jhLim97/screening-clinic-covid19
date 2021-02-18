module.exports = {
    server_port:3300,
    db_url:'mongodb://localhost:27017/clinic',
    db_schemas: [
        {file:'./clinic_schema', collection:'clinic12', schemaName:'ClinicSchema', modelName:'ClinicModel'}
    ],
    route_info: [
        {file:'./clinic', path:'/process/listclinic_seonbyeol', method:'listclinic_seonbyeol', type:'post'},
        {file:'./clinic', path:'/process/listclinic_kukmin', method:'listclinic_kukmin', type:'post'},
        {file:'./clinic', path:'/process/listclinic_geomsa', method:'listclinic_geomsa', type:'post'}
    ]
};