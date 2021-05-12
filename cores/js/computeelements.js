/**
 *
 * @param csvContent
 * @param selectedColumns - these are the columns to be resulted (clean unwanted columns) + the added indices
 * @return {*}
 */
function cleanAndAddPedologicalFeatures(csvContent, selectedColumns) {
    let alAW = 26.9815385,
        oAW = 15.999,
        siAW = 28.085,
        feAW = 55.845,
        tiAW = 47.867,
        Al2O3AW = alAW * 2 + oAW * 3,
        alRatio = alAW * 2 / Al2O3AW,
        siO2AW = siAW + 2 * oAW,
        siRatio = siAW / siO2AW,
        Fe2O3AW = feAW * 2 + oAW * 3,
        feRatio = feAW * 2 / Fe2O3AW,
        tiO2AW = tiAW + 2 * oAW,
        tiRatio = tiAW / tiO2AW;
    const result = csvContent.map(row => {
        //Use only the detected elements
        let temp = {};
        selectedColumns.forEach(c => {
            temp[c] = row[c];
        });
        row = temp;

        //Calculate Ruxton weathering index
        let si = (row["Si Concentration"] === "<LOD") ? 0 : +row["Si Concentration"],
            al = (row["Al Concentration"] === "<LOD") ? 0 : +row["Al Concentration"],
            al2o3 = al / alRatio,
            sio2 = si / siRatio;
        let RI = sio2 / al2o3;
        row["RI Concentration"] = RI + "";
        //Desilication index
        let fe = (row["Fe Concentration"] === "<LOD") ? 0 : +row["Fe Concentration"],
            ti = (row["Ti Concentration"] === "<LOD") ? 0 : +row["Ti Concentration"],
            fe2o3 = fe / feRatio,
            tio2 = ti / tiRatio;
        let DI = sio2 / (al2o3 + fe2o3 + tio2);
        row["DI Concentration"] = DI + "";
        // Elemental ratio of elements resistant to weathering
        let zr = (row["Zr Concentration"] === "<LOD") ? 0 : +row["Zr Concentration"];
        let SR = ti / zr;
        row["SR Concentration"] = SR + "";
        return row;
    });
    return {rows: result, addedElements: ['RI Concentration', 'DI Concentration', 'SR Concentration']};
}
