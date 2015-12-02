/**
 * Created by Ascarbek on 01.12.2015.
 */
(function(){
    'use strict';

    angular
        .module('demo', ['azSuggestBox'])
        .controller('demo', ['$scope', function($scope){
            /*this.items = [
                {id: 0, text: 'text1'},
                {id: 1, text: 'text2'},
                {id: 2, text: 'text3'}
            ];*/

            this.items = [{"id":61,"name":"Logex (Лоджекс)","address":96,"bin":"","rate":1,"accountNumber":"80000089","person":77},{"id":46,"name":"АО «Alageum Electric»","address":76,"bin":"090941017692","rate":1,"accountNumber":"","person":null},{"id":58,"name":"АО «Евразиан Фудс Корпорэйшн»","address":89,"bin":"940540001140","rate":1,"accountNumber":"","person":null},{"id":62,"name":"ИП «Discovery»","address":97,"bin":"821005301118","rate":1,"accountNumber":"","person":79},{"id":50,"name":"Рондо","address":81,"bin":"000000000000","rate":1,"accountNumber":"","person":null},{"id":42,"name":"ТОО «ALEKS-ASU»","address":72,"bin":"110940014490","rate":1,"accountNumber":"","person":null},{"id":44,"name":"ТОО «Ai-SerTransGroup»","address":74,"bin":"110240022109","rate":1,"accountNumber":"","person":null},{"id":59,"name":"ТОО «Aida KaumeNOVA»/ТОО Аида Кауменова\"\"","address":90,"bin":"070940005570","rate":1,"accountNumber":"","person":null},{"id":45,"name":"ТОО «AktobeEuroElectric»","address":75,"bin":"120640009940","rate":1,"accountNumber":"","person":null},{"id":49,"name":"ТОО «GTS Eurasia»","address":94,"bin":"070440002706","rate":1,"accountNumber":"80000094","person":74},{"id":47,"name":"ТОО «Ice Development»","address":78,"bin":"130340018861","rate":1,"accountNumber":"","person":null},{"id":48,"name":"ТОО «Ice season»","address":79,"bin":"091240005561","rate":1,"accountNumber":"","person":null},{"id":51,"name":"ТОО «Indeco Group»","address":82,"bin":"130640002638","rate":1,"accountNumber":"","person":null},{"id":52,"name":"ТОО «KazDuCo Services» (КазДуко Сервисез)","address":83,"bin":"121240001894","rate":1,"accountNumber":"","person":null},{"id":53,"name":"ТОО «MARK TIRES»","address":84,"bin":"070240014594","rate":1,"accountNumber":"","person":null},{"id":54,"name":"ТОО «MIA Group» /ЭмАйЭй Групп/","address":85,"bin":"070140012376","rate":1,"accountNumber":"","person":null},{"id":55,"name":"ТОО «SKYMAX  INTEGRATIONS»","address":86,"bin":"120640020406","rate":1,"accountNumber":"","person":null},{"id":43,"name":"ТОО «Атис»","address":77,"bin":"980 440 000 224","rate":1,"accountNumber":"","person":null},{"id":57,"name":"ТОО «Гериал»","address":88,"bin":"040740011651","rate":1,"accountNumber":"","person":null},{"id":56,"name":"ТОО «Группа компаний «SKYMAX TECHNOLOGIES»","address":87,"bin":"020140002386","rate":1,"accountNumber":"","person":null}];

            this.selectedItem = [
            ];

            this.selectedItem.push(this.items[1]);
            this.selectedItem.push(this.items[2]);
            this.selectedItem.push(this.items[3]);
        }]);
})();
