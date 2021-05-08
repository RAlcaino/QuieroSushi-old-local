<template>
    <div>
        <q-td auto-width>
    
            <q-btn size="sm" :color="color" round dense @click="toggle = !toggle" :icon="'more_vert'" >
                <q-menu persistent auto-close>
                    <q-list style="min-width: 100px">
                        <slot></slot>
                    </q-list>
                </q-menu>
            </q-btn>
        
        </q-td>  
    </div>


</template>

<script>
export default {
    props:['props', 'color'],
    data(){
        return{
            toggle:false
        }
    }

}
</script>

<style>

</style>