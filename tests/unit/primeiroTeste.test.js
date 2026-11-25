function verificationids(ids) {
    
    let idsUnicos = new Set(ids)

    if(ids.length === idsUnicos.size){
        return false
    } else {
        return true
    }
}
test("retorna false quando nao ha ids duplicados", function(){
    expect(verificationids([1,2,3])).toBe(false)
})

test("retorna true quando ha ids duplicados", function(){
    expect(verificationids([1,1,2,3])).toBe(true)
})

test("retorna false para array vazio", function(){
    expect(verificationids([])).toBe(false)
})