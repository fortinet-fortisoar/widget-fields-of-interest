'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('fieldsOfInterest100Ctrl', fieldsOfInterest100Ctrl);

    fieldsOfInterest100Ctrl.$inject = ['$scope', '$state', 'Entity', 'FormEntityService', 'Modules', 'viewTemplate', '$timeout'];

    function fieldsOfInterest100Ctrl($scope, $state, Entity, FormEntityService, Modules, viewTemplate, $rootScope, $timeout ) {
        $scope.id = $state.params.id;
        $scope.module = $state.params.module;
        $scope.updateFieldValues = updateFieldValues;
        $scope.notifyFieldChange = notifyFieldChange;
        $scope.viewValueChange = viewValueChange;
        $scope.submitField = FormEntityService.submitField;
        $scope.$on('template:refresh', function(event, changedFields) {
            angular.forEach(changedFields, function(field) {
              $scope.notifyFieldChange(field.value, field);
            });
            init();
        });

        if (!$scope.entity) {
            $scope.entity = FormEntityService.get();
        }

        function init() {
            if ($scope.entity) {
                getFields();
                $scope.initialized = true;

            }
            var entity = new Entity($scope.module);
            entity.get($scope.id, {
                $relationships: true
            }).then(function () {
                $scope.entity = entity;
                getFields();
            }).finally(function() {
                $scope.initialized = true;
            });
        }
        init();

        function getMissingFields() {
            var configRows = $scope.config.rows[0].columns;
            var selectedFields = [];
            configRows.forEach(function (column, index) {
                column.fields.forEach(function (fields) {
                    selectedFields.push( fields.name );
                })
            })

            var missingFields = [];
            var excludeArray =[];
            $scope.config.excludeFieldsArray.forEach(function(field, index){
                excludeArray.push(field.name);
            })
            for (const key in $scope.entity.fields) {
                if (!selectedFields.includes(key) && !excludeArray.includes(key)  && $scope.entity.fields[key].type !== 'manyToMany'
                    && $scope.entity.fields[key].type !== 'picklist' && $scope.entity.fields[key].type !== 'oneToMany') {
                    missingFields.push({
                        name: key,
                        readOnly : true
                    });
                }
            }
            return missingFields;
        }

        function getFields() {
            var configRows = angular.copy($scope.config.rows);
            if (!configRows) {
                $scope.rows = [];
                return;
            }
            if ($scope.config.includeAll) {
                if (!configRows[0].columns[configRows[0].columns.length - 1]['includeAll']) {
                    configRows[0].columns.push({
                        'fields': getMissingFields(),
                        'includeAll': true,
                        'columnTitle': 'Others'
                    });
                }
            }
            else {
                if (configRows[0].columns[configRows[0].columns.length - 1].hasOwnProperty('includeAll')) {
                    configRows[0].columns.pop();
                }
            }
            configRows.forEach(function (row) {
                var defaultColumnStyle = viewTemplate.getColumnStyle(row.columns.length);
                row.columns.forEach(function (column) {
                    column.style = defaultColumnStyle;
                    column.fields = $scope.updateFieldValues(column.fields);
                });
            });
            $scope.rows = configRows;
            console.log(configRows);
        }

        function updateFieldValues(fields) {
            var fieldValues = [];
            fields.forEach(function (field, index) {
                var fieldValue;
                if (angular.isObject(field) && $scope.entity.fields.hasOwnProperty(field.name)) {
                    if ($scope.config.hideEmptyFields) {
                        if ($scope.entity.fields[field.name].value === null || $scope.entity.fields[field.name].value === '' || $scope.entity.fields[field.name].value === undefined) {
                            return;
                        }
                    }
                    fieldValue = {
                        options: field,
                        fieldData: $scope.entity.fields[field.name]
                    };
                } else if (angular.isObject(field) && field.hasOwnProperty('fieldData')) {
                    if (field['fieldData'].value === null || field['fieldData'].value === '' || field['fieldData'].value === undefined) {
                        return;
                    }
                    fieldValue = field;
                } else {
                    if ($scope.entity.fields[field].value === null || $scope.entity.fields[field].value === '' || $scope.entity.fields[field].value === undefined) {
                        return;
                    }
                    fieldValue = {
                        fieldData: $scope.entity.fields[field]
                    };
                }
                if (fieldValue.fieldData) {
                    fieldValue.fieldData.visible = true;
                    fieldValue.fieldData.visibility = true;
                    fieldValues.push(fieldValue);
                }
            });
            return fieldValues;
        }
        function notifyFieldChange(value, field) {
            field.value = value;
            $scope.viewValueChange(field);
            $rootScope.$broadcast('csFields:viewValueChange', {
              field: field,
              entity: $scope.entity
            });
          }
      
          function viewValueChange(field) {
            if ($scope.entity.fields.hasOwnProperty(field.name)) {
              $scope.entity.fields[field.name].value = field.value;
              $scope.entity.fields[field.name].saving = true;
              $timeout(function() {
                $scope.entity.fields[field.name].saving = false;
              }, 1000);
              $scope.entity.evaluateAllFields();
              return true;
            }
            return false;
          }


        // function getSelectedFields(record) {
        //     $scope.dataToDisplay = [];
        //     $scope.dataToDisplay1 = [];
        //     if (record.originalData === undefined) {
        //         return 'error';
        //     }
        //     var numberOfFields = $scope.config.moduleFields.length;
        //     if ($scope.config.includeExclude === "Include") {
        //         for (var i = 0; i < numberOfFields; i++) {
        //             var recordValue = record.originalData[$scope.config.moduleFields[i].name];
        //             if ($scope.config.hideEmptyFields && (recordValue === undefined || recordValue === null)) {
        //                 continue;
        //             }
        //             $scope.dataToDisplay.push({
        //                 'value': recordValue,
        //                 'name': $scope.config.moduleFields[i].name,
        //                 'title': $scope.config.moduleFields[i].title
        //             })
        //             $scope.dataToDisplay1 = $scope.config.moduleFields;
        //         }
        //     }
        //     else {
        //         var names = [];
        //         if (!$scope.config.includeAll) {
        //             for (var i = 0; i < numberOfFields; i++) {
        //                 names.push($scope.config.moduleFields[i].name);
        //             }
        //         }
        //         excludeFields(record, names);
        //     }
        // }

        // function excludeFields(record, names) {
        //     for (const key in record.originalData) {
        //         if (key === undefined) {
        //             continue;
        //         }
        //         var recordValue = record.originalData[key];
        //         if ($scope.config.hideEmptyFields && (recordValue === undefined || recordValue === null)) {
        //             continue;
        //         }
        //         if (!names.includes(key) && !key.startsWith('@') && (key in record.fields)) {
        //             $scope.dataToDisplay.push({
        //                 'value': record.originalData[key],
        //                 'name': key,
        //                 'title': record.fields[key].title
        //             });
        //         }
        //     }

        // }

        // function generateStructure() {
        //     var numberOfFields = $scope.config.moduleFields.length;
        //     if (numberOfFields % 2 === 0) {
        //         var column = numberOfFields / 2 - 1;
        //     }
        //     else {
        //         var column = numberOfFields / 2;
        //     }
        //     $scope.column = [];
        //     for (var i = 0; i < column; i++) {
        //         for (var j = 0; j < 2; j++) {
        //             $scope.column[i].row[j] = $scope.config.moduleFields[i * 1 + j];
        //         }
        //     }
        // }
    }
})();
