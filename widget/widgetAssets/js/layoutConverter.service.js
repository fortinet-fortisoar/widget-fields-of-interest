/* Copyright start
    MIT License
    Copyright (c) 2026 Fortinet Inc
Copyright end */

'use strict';
(function () {
    angular
        .module('cybersponse')
        .factory('layoutConverterService', layoutConverterService);

    layoutConverterService.$inject = [];

    function layoutConverterService() {

        var service = {
            convertLayout: convertLayout
        };

        function convertLayout(data) {
            return data.map(item => {
                const output = {
                style: item.style,
                columns: []
                };
                // Ensure exactly 3 columns
                for (let i = 0; i < 3; i++) {
                const column = item.columns[i];

                if (!column) {
                    output.columns.push({
                    sections: [],
                    style: "col-lg-4"
                    });
                    continue;
                }

                output.columns.push({
                    sections: [
                    {
                        fields: column.fields || [],
                        sectionTitle: column.columnTitle
                    }
                    ],
                    style: column.style
                });
                }
                // If more than 3 columns exist, append to last column
                if (item.columns.length > 3) {
                for (let i = 3; i < item.columns.length; i++) {
                    const extraColumn = item.columns[i];

                    output.columns[2].sections.push({
                    fields: extraColumn.fields || [],
                    sectionTitle: extraColumn.columnTitle
                    });
                }
                }
                return output;
            });
        }

        return service;
    }
})();
