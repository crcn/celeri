exports.padLeft = function(buffer, n, char)
{
    return exports.repeat(char, n) + buffer;
}

exports.padRight = function(buffer, n, char)
{
    return buffer + exports.repeat(char, n);
}

exports.fill = function(leftChar, ln, rightChar, rn)
{
    return exports.repeat(leftChar, ln) + exports.repeat(rightChar, rn);
}

exports.repeat = function(char, n)
{
    var buffer = '';
    
    for(var i = n; i--;)
    {
        buffer += char;
    }
    
    return buffer;
}