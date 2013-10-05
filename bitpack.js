define(['underscore'], function(_) {

    var module = {};
    
    // PACK_WIDTH can be in the range of 1-4.
    // The choice of this value is determined by the efficiency of the numbers engine.
    // Larger PACK_WIDTHs require larger numbers to be represented by the numbers engine.
    var PACK_WIDTH = 3,
        CHAR_MIN = 32,
        CHAR_MAX = 126;
    
    var packer = function(substr) {
        var code = function(i) { return substr.charCodeAt(i) - CHAR_MIN; };
        var num = 0;
        if(substr.length >= 1) { num += code(0); }
        if(substr.length >= 2) { num += code(1) << 7; }
        if(substr.length >= 3) { num += code(2) << 14; }
        if(substr.length >= 4) { num += code(3) << 21; }
        return num;
    };
    
    var unpacker = function(num, chars) {
        chars = chars || PACK_WIDTH;
        var str = '';
        for(var i = 0; i < chars; i++) {
            str += String.fromCharCode((num & 127) + CHAR_MIN);
            num = num >> 7;
        }
        
        return str;
    };
    
    module.pack = function(str) {
        str = String(str);
        
        var i, c;
        for(i = 0; i < str.length; i++) {
            c = str.charCodeAt(i);
            if(c < CHAR_MIN || c > CHAR_MAX) { throw 'Invalid character in input.'; }
        }
        
        var result = [ str.length % PACK_WIDTH ];
        for(var i = 0; i < str.length; i+=PACK_WIDTH) {
            result.push(packer(str.substr(i, PACK_WIDTH)));
        }
        
        return result;
    };
    
    module.unpack = function(arr) {
        var lastBlockLength = arr[0];
        var result = '';
        
        for(var i = 1; i < arr.length - 1; i++) {
            result += unpacker(arr[i]);
        }
        
        result += unpacker(arr[arr.length - 1], lastBlockLength);
        
        return result;
    };
    
    module.test = function() {
        var input = 'This is a test string';
        var packed = module.pack(input);
        console.log(packed);
        var unpacked = module.unpack(packed);
        console.log(unpacked);
    };
    
    return module;
    
});