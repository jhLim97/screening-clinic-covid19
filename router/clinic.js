

// open API 웹 데이터 수집 소스
var request = require('request');
var parseString = require('xml2js').parseString;

var url = 'http://apis.data.go.kr/B551182/pubReliefHospService/getpubReliefHospList';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '=발급받은 서비스 키'; /* Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
queryParams += '&' + encodeURIComponent('numOfRows') + '=';/* */
//queryParams += '&' + encodeURIComponent('spclAdmTyCd') + '=' + encodeURIComponent('A0'); /* */

var queryParamNumOfRows = encodeURIComponent('10');

var totalDataNum;

var totalNum = function(database) {
    request({
    url: url + queryParams + queryParamNumOfRows,
    method:'GET'
}, function(error, response, body) {
    parseString(body, function(err, r) {
        totalDataNum = r.response.body[0].totalCount[0];
        console.log('총 개수 : ' + totalDataNum);
        init(database);
    });
})};

var init = function(database) {
    request({
    url: url + queryParams + encodeURIComponent(totalDataNum),
    method: 'GET'
}, function (error, response, body) {
    //console.log('Status', response.statusCode);
    //console.log('Headers', JSON.stringify(response.headers));
    //console.log('Reponse received', body);
    parseString(body, function(error, r) {
        //console.log(JSON.stringify(r));         
        //var database = req.app.get('database');
        data.forEach(function(item, index) {
            addClinic(database, item);
        });
        
        
    });
})};

var addClinic = function(database, item) {
    console.log('addClinic 함수 호출됨.');
    
    var clinic = new database.ClinicModel({clinic:item});
        clinic.save(function(err) {
            if(err) {
                //callback(err, null);
                console.log('선별 진료소 데이터 추가실패.');
                console.dir(err);
                return;
            }
            console.log('선별 진료소 데이터 추가함.');
            //callback(null, clinic);
    })
}

var listclinic = function(req, res) {
    console.log('/process/listclinic 라우팅 함수 호출됨.');
    
    // 시도 및 시군구, 선별진료소, 전화번호를 통합한 검색 정보
    var paramKeyword = req.body.keyword || req.query.keyword;
    
    console.log('요청 검색어 : ' + paramKeyword);
    
    var database = req.app.get('database');
    if(database) {           
        database.ClinicModel.findByKeyword(paramKeyword, 
        function(err, results) {
            if(err) {
               console.log('에러 발생.');
               res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
               res.write('<h1>에러 발생</h1>');
               res.end();
               return;
           } 
            
            if(results) {
                //console.dir(results);
                
                var context = {
                    results:results
                };
                req.app.render('index', context, function(err, html) {
                    if(err) {
                        console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        console.log('에러 발생.');

                        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                        res.write('<h1>뷰 렌더링 중 에러 발생</h1>');
                        res.write('<br><p>' + err.stack + '<p>');
                        res.end();
                        return;
                    }
                
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.end(html);
                });
                
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>검색 실패.</h1>');
                res.end();
            }
        })
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
};

var listclinic_kukmin = function(req, res) {
    console.log('/process/listclinic_kukmin 라우팅 함수 호출됨.');
    
    // 시도 및 시군구, 선별진료소, 전화번호를 통합한 검색 정보
    var paramKeyword = req.body.keyword || req.query.keyword;
    
    console.log('요청 검색어 : ' + paramKeyword);
    
    var database = req.app.get('database');
    if(database) {           
        database.ClinicModel.findByKeyword(paramKeyword, 
        function(err, results) {
            if(err) {
               console.log('에러 발생.');
               res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
               res.write('<h1>에러 발생</h1>');
               res.end();
               return;
           } 
            
            if(results) {
                //console.dir(results);
                
                var context = {
                    results:results
                };
                req.app.render('index_2', context, function(err, html) {
                    if(err) {
                        console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);
                        console.log('에러 발생.');

                        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                        res.write('<h1>뷰 렌더링 중 에러 발생</h1>');
                        res.write('<br><p>' + err.stack + '<p>');
                        res.end();
                        return;
                    }
                
                    res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                    res.end(html);
                });
                
            } else {
                console.log('에러 발생.');
                res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>검색 실패.</h1>');
                res.end();
            }
        })
    } else {
        console.log('에러 발생.');
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>데이터베이스 연결 안됨.</h1>');
        res.end();
    }
};


module.exports.totalNum = totalNum;
module.exports.listclinic = listclinic;
module.exports.listclinic_kukmin = listclinic_kukmin;