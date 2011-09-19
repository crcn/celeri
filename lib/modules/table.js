exports.plugin = function(cli)
{
    
    //draw table params & columns
    //cli.drawTable(..., {name: 20, age: 20}
    //TODO
    cli.drawTable = function(objects, ops)
    {
        if(!(objects instanceof Array)) objects = [objects];
        
        var windowWidth = ops.width || cli.columns(),
        columns = ops.columns,
        colArray = [],
        virt = ops.virtical   || ops.virt,
        horz = ops.horizontal || ops.horz;
        
        
        if(ops.padRight) windowWidth -= ops.padRight;
        
        
        if(ops.border)
        {
            if(!virt) virt = ' | ';
            if(!horz) horz = '–'; 
        }
        
        var tableWidth = 0,
        title = {};
        
        //convert the object into an array
        if(columns instanceof Array)
        {
            colArray = columns;
            
            var numColumns = colArray.length;
            
            for(var i = numColumns; i--;)
            {
                var col = colArray[i];
                
                if(typeof col == 'string')
                {
                    colArray[i] = col = {
                        name: col,
                        width: Math.round(numColumns/windowWidth)
                    };
                }
                
                title[col.name] = col.name;
                tableWidth += col.width;
            }
        }
        else
        {
            for(var property in columns)
            {
                var param = columns[property];
                
                if(typeof param == 'number')
                {
                    param = {
                        width: param,
                    };
                }
                
                param.name = property;
                tableWidth += param.width || 0;
                
                title[param.name] = param.name;
                colArray.push(param);
            }
        }
        
        //objects.unshift(title);
        
        
        objects.forEach(function(object)
        {
        
            var buffer = '';
            
            for(var i = 0, n = colArray.length; i < n; i++)
            {
                var columnInfo = colArray[i];
                
                if(typeof columnInfo == 'string')
                {
                    columnInfo = {
                        name: columnInfo
                    };
                }
                
                if(!columnInfo.width) columnInfo.width = Math.round(100/n);
                
                columnName = columnInfo.name;
                
                
                columnWidth = Math.min(columnInfo.width, Math.round((columnInfo.width/tableWidth) * windowWidth));
                
                
                if(i == n-1)
                {
                    columnWidth = windowWidth-buffer.length;
                    //if(!columnInfo.align) columnInfo.align = 'right';
                }
                
                if(virt)
                {
                    columnWidth -= virt.length;
                }
                
                
                var str = (object[columnName] || 'Undefined').toString(),
                padding = Math.max(columnWidth - str.length, 0);
                                
                if(str.length > columnWidth) str = str.toString().substr(0, columnWidth-3) + '...';
                
                var colStr;
                
                
                switch(columnInfo.align)
                {
                    case 'right':
                        colStr = cli.utils.padLeft(str, padding, ' ');
                        break;
                    
                    case 'center':
                        colStr = cli.utils.repeat(Math.floor(padding/2), ' ') +
                        str +
                        cli.utils.repeat(Math.ceil(padding/2), ' ');
                        break;
                        
                    default: 
                        colStr = cli.utils.padRight(str, padding, ' ');
                        break;
                        
                }
                
                if(virt)
                {
                    colStr = colStr + virt;
                }
                
                
                buffer += colStr;
                
                
            }
            
            if(horz) console.log(cli.utils.repeat(horz,windowWidth));
            
            console.log(buffer);
        });
        
        
        if(horz) console.log(cli.utils.repeat(horz,windowWidth));
    }
}