'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('fieldsOfInterest102Ctrl', fieldsOfInterest102Ctrl);

    fieldsOfInterest102Ctrl.$inject = ['$scope', '$state', 'Entity', 'FormEntityService', 'Modules', 'viewTemplate', '$rootScope', '$timeout'];

    function fieldsOfInterest102Ctrl($scope, $state, Entity, FormEntityService, Modules, viewTemplate, $rootScope, $timeout) {
        $scope.id = $state.params.id;
        $scope.module = $state.params.module;
        $scope.updateFieldValues = updateFieldValues;
        $scope.notifyFieldChange = notifyFieldChange;
        $scope.viewValueChange = viewValueChange;
        $scope.submitField = FormEntityService.submitField;
        $scope.$on('template:refresh', function (event, changedFields) {
            angular.forEach(changedFields, function (field) {
                $scope.notifyFieldChange(field.value, field);
            });
            init();
        });
        $scope.init = init;

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
            }).finally(function () {
                $scope.initialized = true;
            });
        }
        init();

        //Get all feilds which are not selected
        function getMissingFields() {
            var configRows = $scope.config.rows[0].columns;
            var selectedFields = [];
            configRows.forEach(function (column, index) {
                column.fields.forEach(function (fields) {
                    selectedFields.push(fields.name);
                })
            })

            var missingFields = [];
            var excludeArray = [];
            $scope.config.excludeFieldsArray.forEach(function (field, index) {
                excludeArray.push(field.name);
            })
            for (const key in $scope.entity.fields) {
                if (!selectedFields.includes(key) && !excludeArray.includes(key) && $scope.entity.fields[key].type !== 'manyToMany'
                   && $scope.entity.fields[key].type !== 'oneToMany' && $scope.entity.fields[key].type && $scope.entity.fields[key].type !== null) {
                    missingFields.push({
                        name: key,
                        readOnly: true
                    });
                }
            }
            return missingFields;
        }
        
        function sortByTitle(arraytoSort) {
            arraytoSort.sort(function(field1, field2) {
              var nameA = field1.fieldData.title.toUpperCase(); // ignore upper and lowercase
              var nameB = field2.fieldData.title.toUpperCase(); // ignore upper and lowercase
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              // Title must be equal
              return 0;
            });
          }
          

        function getFields() {
            var configRows = angular.copy($scope.config.rows);
            if (!configRows) {
                $scope.rows = [];
                return;
            }
            if ($scope.config.includeAll) {
                // create an Others column for the remaining include all fields
                if (!configRows[0].columns[configRows[0].columns.length - 1]['includeAll']) {
                    configRows[0].columns.push({
                        'fields': getMissingFields(),
                        'includeAll': true,
                        'columnTitle': 'Others'
                    });
                }
            }
            // On Config edit, if include_all is unchecked remove the column "Others"
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
            //to sort others column
            if($scope.config.includeAll){
                sortByTitle($scope.rows[0].columns[$scope.rows[0].columns.length - 1].fields);
            }
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
                //Show Hidden fields, visiblity true
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
                $timeout(function () {
                    $scope.entity.fields[field.name].saving = false;
                }, 1000);
                $scope.entity.evaluateAllFields();
                return true;
            }
            return false;
        }

    }
})();
