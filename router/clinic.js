

// open API 웹 데이터 수집 소스
var request = require('request');
var parseString = require('xml2js').parseString;

var url = 'http://apis.data.go.kr/B551182/pubReliefHospService/getpubReliefHospList';
var queryParams = '?' + encodeURIComponent('ServiceKey') + '= 발급받은 서비스 키'; /* Service Key*/
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
        // 각 요소 표시
        console.log(r.response.body[0].items[0].item[9].yadmNm);
        var data = r.response.body[0].items[0].item;
        console.log(data[9].yadmNm);
        //console.log(data);
        console.log("---");
        console.log(r.response.body[0].items[0].item[0].adtFrDd[0]);
        //console.log(r.response.body[0].items[0].item[0].hospTyTpCd[0]);
        console.log(r.response.body[0].items[0].item[0].sgguNm[0]);
        console.log(r.response.body[0].items[0].item[0].sidoNm[0]);
        console.log(r.response.body[0].items[0].item[0].spclAdmTyCd[0]);
        console.log(r.response.body[0].items[0].item[0].telno[0]);
        console.log(r.response.body[0].items[0].item[0].yadmNm[0]);
        
        //var database = req.app.get('database');
        var clinic = new database.ClinicModel({clinic:data});
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
    });
})};


var listclinic = function(database) {
    console.log('/process/listclinic 라우팅 함수 호출됨.');
    
    // 시도 및 시군구, 선별진료소, 전화번호를 통합한 검색 정보
    //var paramKeyword = req.body.keyword || req.query.keyword;
    var paramKeyword = '064';
    
    console.log('요청 검색어 : ' + paramKeyword);
    
    //var database = req.app.get('database');
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
                console.dir(result);
                //res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
                //res.write('<h1>clinic 조회 성공</h1>');
                //res.write('<div><p>검색어 : ' + paramKeyword + '</p></div>');
                //res.write('<div><p>시도 : ' + result[0].tel + '</p></div>');
                //res.end();
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