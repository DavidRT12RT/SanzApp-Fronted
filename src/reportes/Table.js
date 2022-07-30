import { Text, View, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
    table: {
        width: '100%',
        borderWidth: 2,
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 12
    },
    tableRow:{
        display: 'flex',
        flexDirection: 'row',
    },
    cell: {
        borderWidth: 1,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap'
    }
    })   

export const Table = ({children, col, th}) => (
    <View style={styles.table}>
        {children.map((row, ind) =>
            <View key={ind} style={[styles.tableRow, th && ind === 0 ? styles.em: {}]}>
                {row.map((cell, j) =>
                    <View key={j} style={[styles.cell, {width:col[j], minHeight:40,padding:10}]}>
                        {
                            typeof(cell) === 'string' || typeof(cell) === 'number' ? 
                            <Text>{cell}</Text> : cell
                        }
                    </View>
                )}
            </View>
        )}
    </View>
)