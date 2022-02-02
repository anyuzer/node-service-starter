class NextMock{
    spy(){
        return (_data)=>{
            this.data = _data;
        };
    }
}

module.exports = NextMock;