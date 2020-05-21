const watchMixin = {
    watch: {
        errorState() {
            if (this.errorState == true) {
                setTimeout(() => {
                    for (let ref in this.$refs) {
                        if (this.$refs[ref].classList.contains('uk-form-danger')) {
                            this.$refs[ref].classList.remove('uk-form-danger')
                        }
                    }
                    this.errors.length = 0
                    this.errorState = false
                }, 2500)
            }
        }
    }
}

export default watchMixin