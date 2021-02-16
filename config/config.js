module.exports = {
    server_port:3300,
    db_url:'mongodb://localhost:27017/clinic',
    db_schemas: [
        {file:'./clinic_schema', collection:'clinic1', schemaName:'ClinicSchema', modelName:'ClinicModel'}
    ],
    route_info: []
};